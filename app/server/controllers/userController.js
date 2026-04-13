const userService = require('../services/userService')

const sendCode = require('../config/resend')

exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers()
    res.json(users)
}

exports.getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id)
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
}

exports.createUser = async (req, res) => {
    const user = await userService.createUser(req.body)
    if(!user){
        return res.status(401).json({ message: "User couldn't be created" })
    }
    res.status(201).json(user)
}

update = async (idUser, data, res) => {
    const id = Number(idUser)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid id" })
    }

    const user = await userService.updateUser(id, data)
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
}

exports.updateProfile = async (req, res) => {
    await update(req.session.user.id, req.body, res)
}

exports.updateUser = async (req, res) => {
    await update(req.params.id, req.body, res)
}

exports.deleteUser = async (req, res) => {
    const user = await userService.deleteUserById(req.params.id)
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }
    res.send("User deleted")
}

exports.register = async (req, res) => {
    const u = await userService.getUserByEmail(req.body.email)

    if(u){
        return res.status(401).json({ message: "Email already used by another user" })
    }

    const user = await userService.createUser(req.body)

    user.isVerified = false
    await userService.generateCode(user)

    req.session.pendingUserId = user.id
    try{
        await sendCode(user.email, user.verificationCode)
    } catch(err) {
        console.error(err)
    }

    res.status(200).json({ message: "Code sent" })
}

exports.login = async (req, res) => {
    const user = await userService.getUserByEmail(req.body.email)

    if(!user){
        return res.status(404).json({ message: "User not found" })
    }

    const checkPassword = await userService.comparePassword(req.body.password,user.password)

    if(!checkPassword){
        return res.status(401).json({ message: "Wrong password" })
    }

    await userService.generateCode(user)

    req.session.pendingUserId = user.id
    try{
        await sendCode(user.email, user.verificationCode)
    } catch(err) {
        console.error(err)
    }

    res.status(200).json({ message: "Code sent" })
}

exports.verifyCode = async (req, res) => {
    const user = await userService.getUserById(req.session.pendingUserId)

    if(!user){
        return res.status(404).json({ message: "User not found" })
    }

    if(user.codeExpiresAt < Date.now()){
        return res.status(401).json({ message: "Code expired" })
    }

    if(user.codeAttempts > 3){
        return res.status(401).json({ message: "Too many attempts" })
    }

    if(user.verificationCode !== req.body.code){
        user.codeAttempts += 1
        await user.save()
        return res.status(401).json({ message: "Wrong verification code" })
    }

    userService.loginSuccess(user, req.session)

    res.status(200).json({ message: "Valid code" })
}

exports.session = async (req, res) => {
    res.json({ user: req.session.user })
}

exports.myProfile = async (req, res) => {
    const user = await userService.getUserProfileById(Number(req.session.user.id))
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
}

exports.publicProfile = async (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid id" })
    }

    const user = await userService.getUserPublicProfileById(id)
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
}