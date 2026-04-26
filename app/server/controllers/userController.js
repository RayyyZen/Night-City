const userService = require('../services/userService')

const AppError = require('../errors/AppError')

const errorHandler = (err, res) => {
    if(err instanceof AppError){
        return res.status(err.status).json({ message: err.message })
    }
    console.error(err)
    res.status(500).json({ message: "Server Error" })
}

exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers()
    res.json(users)
}

exports.getUserById = async (req, res) => {
    try{
        const user = await userService.getUserById(req.params.id)
        res.json(user)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.createUser = async (req, res) => {
    try{
        const user = await userService.createUser(req.body)
        res.json(user)

    } catch(err) {
        errorHandler(err, res)
    }
}

const update = async (id, data, res, isAdmin) => {
    try{
        const user = await userService.updateUser(id, data, isAdmin)
        res.json(user)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.updateProfile = async (req, res) => {
    await update(req.session.user.id, req.body, res, false)
}

exports.updateUser = async (req, res) => {
    await update(req.params.id, req.body, res, true)
}

exports.deleteUser = async (req, res) => {
    try{
        const user = await userService.deleteUserById(req.params.id)
        res.json({ message: "User deleted" })

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.register = async (req, res) => {
    try{
        const user = await userService.createUser(req.body)
        await userService.generateAndSendCode(user)

        req.session.pendingUserId = user.id
        res.status(200).json({ message: "Code sent" })

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.login = async (req, res) => {
    try{
        const user = await userService.login(req.body.email, req.body.password)
        await userService.generateAndSendCode(user)

        req.session.pendingUserId = user.id
        res.status(200).json({ message: "Code sent" })

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.verifyCode = async (req, res) => {
    try{
        const user = await userService.verifyCode(req.session.pendingUserId, req.body.code)

        await userService.loginSuccess(user)

        req.session.user = {
            id: user.id,
            nickName: user.nickName,
            role: user.role,
            level: user.level
        }

        if(user.building_id){
            req.session.user.building_id = user.building_id
        }

        if(user.building_role){
            req.session.user.building_role = user.building_role
        }

        req.session.pendingUserId = null

        res.status(200).json({ message: "Valid code" })
    
    } catch(err) {
        errorHandler(err, res)
    }
}

exports.session = async (req, res) => {
    let isPending = false
    if(req.session.pendingUserId){
        isPending = true
    }

    let user = null
    if(req.session.user){
        user = req.session.user
    }
    
    res.json({ 
        user: user,
        isPending: isPending
     })
}

exports.myProfile = async (req, res) => {
    try{
        const user = await userService.getUserProfileById(Number(req.session.user.id))
        res.json(user)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.publicProfile = async (req, res) => {
    try{
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError("Invalid id", 400)
        }

        const user = await userService.getUserPublicProfileById(id)
        res.json(user)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.resendCode = async (req, res) => {
    try{
        const user = await userService.getUserById(req.session.pendingUserId)
        await userService.generateAndSendCode(user)

        res.status(200).json({ message: "Code sent" })

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.joinBuilding = async (req, res) => {
    try{
        const user = await userService.joinBuilding(req.session.user.id, req.params.id, req.body.password)

        req.session.user.building_id = user.building_id
        res.status(200).json({ message: "Building joint" })
    
    } catch(err) {
        errorHandler(err, res)
    }
}

exports.updateBuildingRole = async (req, res) => {
    try{
        const user = await userService.updateBuildingRole(req.params.id, req.session.user.id, req.body.building_role)

        req.session.user.building_role = user.building_role
        res.status(200).json({ message: "Role updated" })
    
    } catch(err) {
        errorHandler(err, res)
    }
}

exports.kickFromBuilding = async (req, res) => {
    try{
        const user = await userService.kickFromBuilding(req.params.id)

        res.status(200).json({ message: "User kicked" })

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.leaveBuilding = async (req, res) => {
    try{
        const user = await userService.kickFromBuilding(req.session.user.id)

        req.session.user.building_id = null
        res.status(200).json({ message: "User kicked" })

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.logOut = async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Error" });
        res.json({ message: "Logged out" });
    });
}