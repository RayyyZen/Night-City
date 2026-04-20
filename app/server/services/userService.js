const User = require('../models/User')
const Building = require('../models/Building')
const Counter = require('../models/Counter')

const bcrypt = require('bcrypt')

exports.getAllUsers = async () => {
    try{
        return await User.find()
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.getUserById = async (id) => {
    try{
        return await User.findOne({ id: id })
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.getUserProfileById = async (id) => {
    try{
        return await User.findOne({ id: id }).select('id building_id firstName lastName nickName email role level points')
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.getUserPublicProfileById = async (id) => {
    try{
        return await User.findOne({ id: id }).select('building_id nickName email role level')
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.createUser = async (data) => {
    try{
        
        const counter = await Counter.findOneAndUpdate(
        { name: "userLastId" },
        { $inc: { value: 1 } },
        { returnDocument: "after", upsert: true }
        )

        if(!data || !data.password || !data.image || !data.gender || !data.firstName || !data.lastName || !data.nickName || !data.birthdate || !data.email){
            throw new Error("The data fields are not complete to create the user")
        }

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

    } catch(err) {
        console.error(err)
        return null
    }
}

exports.updateUser = async (id, data) => {

    try{

        const user = await User.findOne({ id: id })

        if(data.image){
            user.image = data.image
        }

        if(data.firstName){
            user.firstName = data.firstName
        }

        if(data.lastName){
            user.lastName = data.lastName
        }

        if(data.password){
            user.password = await bcrypt.hash(data.password, 10)
        }

        await user.save()

        return user

    } catch(err) {
        console.error(err)
        return null
    }
}

exports.deleteUserById = async (id) => {
    try{
        return await User.findOneAndDelete({ id: id })
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.getUserByNickName = async (nickName) => {
    try{
        return await User.findOne({ nickName: nickName })
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.getUserByEmail = async (email) => {
    try{
        return await User.findOne({ email: email })
    } catch(err) {
        console.error(err)
        return null
    }
}

exports.loginSuccess = async (user, session) => {
    if(!user || !session){
        throw new Error("Can't finalize the user's entry")
    }

    const building_id = !user.building_id ? null : user.building_id

    session.user = {
        id: user.id,
        building_id: building_id,
        nickName: user.nickName,
        role: user.role,
        level: user.level
    }

    session.pendingUserId = null

    user.isVerified = true
    user.verificationCode = null
    user.codeAttempts = 0
    user.codeExpiresAt = null
    user.lastTimeOnline = Date.now()

    user.points += 0.25;
    if(user.points < 1){
        user.level = "beginner"
    }
    else if(user.points < 2){
        user.level = "intermediate"
    }
    else if(user.points < 3){
        user.level = "advanced"
    }
    else{
        user.level = "expert"
    }

    await user.save()
}

exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password,hashedPassword)
}

exports.generateCode = async (user) => {
    if(!user){
        throw new Error("Can't generate a code of a non existing user")
    }
    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.codeExpiresAt = Date.now() + 3 * 60 * 1000
    user.codeAttempts = 0
    await user.save()
}

exports.joinBuilding = async (userId, buildingId) => {
    try{
        const building = await Building.findOne({ id: buildingId })
        if(!building){
            return null
        }

        return await User.findOneAndUpdate({ id: userId }, {
            building_id: buildingId,
            building_role: "none"
        }, { returnDocument: "after"})
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.updateBuildingRole = async (id, building_role) => {
    try{
        return await User.findOneAndUpdate({ id: id }, { building_role: building_role }, { returnDocument: "after"})
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.kickFromBuilding = async (id) => {
    try{
        return await User.findOneAndUpdate({ id: id }, {
            $unset: { building_id: "" },
            $unset: { building_role: "" }
        })
    } catch (err) {
        console.error(err)
        return null
    }
}