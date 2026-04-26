const User = require('../models/User')
const Building = require('../models/Building')
const Device = require('../models/Device')
const Counter = require('../models/Counter')

const AppError = require('../errors/AppError')

exports.getAllDevices = async () => {
    return await Device.find()
}

exports.getDevicesByBuildingId = async (building_id) => {
    return await Device.find({ building_id: building_id })
}

deviceNotFound = (device) => {
    if(!device){
        throw new AppError("Device not found", 404)
    }
}

checkDevice = (device) => {
    deviceNotFound(device)
    return device
}

exports.getDeviceById = async (id) => {
    const device = await Device.findById({ id: id })
    return checkDevice(device)
}

exports.createDevice = async (id, userId) => {
    const user = await User.findOne({ id: userId })
    if(!user){
        throw new AppError("User not found", 404)
    }

    if(!user.building_id){
        throw new AppError("User doesn't belong to any building", 401)
    }

    const counter = await Counter.findOneAndUpdate(
    { name: "deviceLastId" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
    )

    return await Device.create({
        id: counter.value,
        building_id: user.building_id,
        user_id: user.id,
        name: data.name,
        description: data.description,
        energy: data.energy
    })
}

exports.updateDevice = async (id, data) => {
    const device = await Device.findOne({ id: id })
    deviceNotFound(device)

    if(data.name){
        device.name = data.name
    }

    if(data.description){
        device.description = data.description
    }

    if(data.energy){
        device.energy = data.energy
    }

    return await device.save()
}

setDevice = async (id, userId, status) => {
    const device = await Device.findOne({ id: id })
    deviceNotFound(device)

    const user = await User.findOne({ id: userId })
    if(!user){
        throw new AppError("User not found", 404)
    }

    if(status != "idle" && status != "in_use" && status != "error"){
        throw new Error("You can only mark a device with one of these status : idle, in_use, error", 401)
    }

    device.status = status
    device.user_id = user.id

    return await device.save()
}

exports.setDeviceIdle = async (id, userId) => {
    return await setDevice(id, userId, "idle")
}

exports.setDeviceUse = async (id, userId) => {
    return await setDevice(id, userId, "in_use")
}

exports.setDeviceError = async (id, userId) => {
    return await setDevice(id, userId, "error")
}

exports.deleteDevice = async (id) => {
    const device = await Device.findOne({ id: id })
    return checkDevice(device)
}