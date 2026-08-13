const User = require('../models/User')
const Building = require('../models/Building')
const Counter = require('../models/Counter')

const bcrypt = require('bcrypt')

const sendCode = require('../config/resend')

const AppError = require('../errors/AppError')

exports.getAllUsers = async () => {
    return await User.find().select('-password')
}

exports.getUsersByBuildingId = async (building_id) => {
    return await User.find({ building_id: building_id }).select('id building_role nickName level')
}

const userNotFound = (user) => {
    if(!user){
        throw new AppError("User not found", 404)
    }
}

const checkUser = (user) => {
    userNotFound(user)
    return user
}

exports.getUserById = async (id) => {
    const user = await User.findOne({ id: id })
    return checkUser(user)
}

exports.getUserProfileById = async (id) => {
    const user = await User.findOne({ id: id }).select('id building_id building_role gender firstName lastName nickName email role level points image')
    return checkUser(user)
}

exports.getUserPublicProfileById = async (id) => {
    const user = await User.findOne({ id: id }).select('building_id building_role gender firstName lastName nickName email level points image')
    return checkUser(user)
}

exports.createUser = async (data) => {
    data.email = data.email.trim().toLowerCase()

    const existingEmail = await User.findOne({ email: data.email })
    if(existingEmail){
        throw new AppError("The email is already used", 409)
    }

    const existingNickName = await User.findOne({ nickName: data.nickName })
    if(existingNickName){
        throw new AppError("The nick name is already used", 409)
    }

    const counter = await Counter.findOneAndUpdate(
    { name: "userLastId" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
    )

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await User.create({
        id: counter.value,
        image: data.image,
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
        nickName: data.nickName,
        birthdate: data.birthdate,
        email: data.email,
        password: hashedPassword
    })
}

exports.updateUser = async (id, data, isAdmin) => {
    const user = await User.findOne({ id: id })
    userNotFound(user)

    if(data.image){
        user.image = data.image
    }

    if(data.firstName){
        user.firstName = data.firstName
    }

    if(data.lastName){
        user.lastName = data.lastName
    }

    if(isAdmin && data.role){
        user.role = data.role
    }

    if(data.password){
        user.password = await bcrypt.hash(data.password, 10)
    }

    return await user.save()
}

exports.deleteUserById = async (id) => {
    const user = await User.findOne({ id: id })
    userNotFound(user)

    if(user.building_id){
        await exports.kickFromBuilding(user.id)
    }

    await User.deleteOne({ id: id })
    return user
}

exports.login = async (email, password) => {
    const userEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: userEmail })
    userNotFound(user)

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        throw new AppError("Wrong password", 401)
    }

    return user
}

exports.loginSuccess = async (user) => {
    if(!user){
        throw new Error("Can't finalize the user's login")
    }

    user.isVerified = true
    user.verificationCode = null
    user.codeAttempts = 0
    user.codeExpiresAt = null
    user.lastTimeOnline = Date.now()

    await user.save()
}

exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password,hashedPassword)
}

exports.generateAndSendCode = async (user) => {
    if(!user){
        throw new Error("Can't generate a code for a non existing user")
    }
    user.isVerified = false
    user.verificationCode = process.env.API_KEY_RESEND
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : '000000'
    user.codeExpiresAt = Date.now() + 3 * 60 * 1000
    user.codeAttempts = 0
    await user.save()

    await sendCode(user.email, user.verificationCode)
}

exports.verifyCode = async (pendingUserId, code) => {
    const user = await User.findOne({ id: pendingUserId })
    userNotFound(user)

    if(user.codeExpiresAt < Date.now()){
        throw new AppError("Code expired", 401)
    }

    if(user.codeAttempts > 3){
        throw new AppError("Too many attempts", 401)
    }

    if(user.verificationCode !== code){
        user.codeAttempts += 1
        await user.save()

        throw new AppError("Wrong verification code", 401)
    }

    return user
}

exports.joinBuilding = async (userId, buildingId, password) => {
    const building = await Building.findOne({ id: buildingId })
    if(!building){
        throw new AppError("You can't join a non existing building", 404)
    }

    const user = await User.findOne({ id: userId })
    userNotFound(user)

    if(user.building_id){
        throw new AppError("You already are in a building", 401)
    }

    if(user.codeAttempts){
        if(user.codeAttempts > 5){
            throw new AppError("Too many attempts", 401)
        }
        user.codeAttempts++
    }
    else{
        user.codeAttempts = 1
    }

    if(!(await bcrypt.compare(password,building.password))){
        throw new AppError("Wrong password", 401)
    }

    user.building_id = buildingId
    user.building_role = "none"
    user.codeAttempts = 0
    user.points = 0
    user.level = "beginner"

    return await user.save()
}

exports.updateBuildingRole = async (userId, creatorId, building_role) => {
    const user = await User.findOne({ id: userId })
    userNotFound(user)

    const creator = await User.findOne({ id: creatorId })
    userNotFound(creator)

    if(!creator.building_id || !user.building_id || creator.building_id != user.building_id){
        throw new AppError("User and building creator are not in the same building", 401)
    }

    const building = await Building.findOne({ id: creator.building_id })
    if(!building){
        throw new AppError("Building not found", 404)
    }

    if(creator.id != building.creatorId){
        throw new AppError("Only the creator of the building can change roles", 401)
    }

    user.building_role = building_role

    return await user.save()
}

exports.kickFromBuilding = async (id) => {
    const user = await User.findOne({ id: id })
    userNotFound(user)

    const building = await Building.findOne({ id: user.building_id })
    if(!building){
        throw new AppError("Building not found", 404)
    }

    if(user.id == building.creatorId){
        const newCreator = await User.findOne({ building_id: building.id, id: { $ne: user.id } })
        if(!newCreator){
            await building.deleteOne()
        }
        else {
            building.creatorId = newCreator.id
            await building.save()

            newCreator.building_role = "owner"
            await newCreator.save()
        }
    }

    user.set('building_id', undefined)
    user.set('building_role', undefined)

    return await user.save()
}