const deviceService = require('../services/deviceService')
const userService = require('../services/userService')

const AppError = require('../errors/AppError')

errorHandler = (err, res) => {
    if(err instanceof AppError){
        return res.status(err.status).json({ message: err.message })
    }
    console.error(err)
    res.status(500).json({ message: "Server Error" })
}

exports.getAllDevices = async (req, res) => {
    const allDevices = await deviceService.getAllNews()
    res.json(allDevices)
}

exports.getMyBuildingDevices = async (req, res) => {
    const allDevices = await deviceService.getDevicesByBuildingId(req.session.user.building_id)
    res.json(allDevices)
}

exports.getDeviceById = async (req, res) => {
    try{
        const device = await deviceService.getDeviceById(req.params.id)
        if(device.building_id != req.session.user.building_id){
            throw new AppError("You are not in the same building as the device", 401)
        }
        res.json(device)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.createDevice = async (req, res) => {
    try{
        const device = await deviceService.createDevice(req.body)
        res.json(device)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.updateDevice = async (req, res) => {
    try{
        const device = await deviceService.updateDevice(req.params.id, req.body, req.session.user)
        res.json(device)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.setDeviceIdle = async (req, res) => {
    try{
        const device = await deviceService.setDeviceIdle(req.params.id, req.session.user.id)
        res.json(device)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.setDeviceUse = async (req, res) => {
    try{
        const device = await deviceService.setDeviceUse(req.params.id, req.session.user.id)
        res.json(device)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.setDeviceError = async (req, res) => {
    try{
        const device = await deviceService.setDeviceError(req.params.id, req.session.user.id)
        res.json(device)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.deleteDevice = async (req, res) => {
    try{
        const device = await deviceService.deleteDevice(req.params.id)
        res.json({ message: "Device deleted" })

    } catch(err) {
        errorHandler(err, res)
    }
}