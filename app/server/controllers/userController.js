const userService = require('../services/userService')

exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers()
    res.json(users)
}

exports.getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id)
    if(!user){
        return res.status(404).send("User not found")
    }
    res.json(user)
}

exports.createUser = async (req, res) => {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
}

exports.updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body)
    if(!user){
        return res.status(404).send("User not found")
    }
    res.json(user)
}

exports.deleteUser = async (req, res) => {
    const user = userService.deleteUserById(req.params.id)
    if(!user){
        return res.status(404).send("User not found")
    }
    res.send("User deleted")
}