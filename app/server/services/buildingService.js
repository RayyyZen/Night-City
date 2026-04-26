const Building = require('../models/Building')
const Counter = require('../models/Counter')

const bcrypt = require('bcrypt')

const userService = require('./userService')
const deviceService = require('./deviceService')

const AppError = require('../errors/AppError')

exports.getAllBuildings = async () => {
    return await Building.find().select('-password')
}

buildingNotFound = (building) => {
    if(!building){
        throw new AppError("Building not found", 404)
    }
}

checkBuilding = (building) => {
    buildingNotFound(building)
    return building
}

exports.getBuildingById = async (id) => {
    const building = await Building.findOne({ id: id })
    return checkBuilding(building)
}

exports.getPublicBuildingById = async (id) => {
    const building = await Building.findOne({ id: id }).select('id name description address area creatorId')
    return checkBuilding(building)
}

exports.getMyBuildingById = async (id) => {
    const building = await Building.findOne({ id: id }).select('id name description address area creatorId')
    buildingNotFound(building)

    const users = await userService.getUsersByBuildingId(id)

    const devices = await deviceService.getDevicesByBuildingId(id)

    return { building, users, devices }
}

exports.createBuilding = async (data, creatorId) => {
    const counter = await Counter.findOneAndUpdate(
    { name: "buildingLastId" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
    )

    const existingName = Building.findOne({ name: data.name })
    if(existingName){
        throw new AppError("The building name is already used", 409)
    }

    const existingAddress = Building.findOne({ address: data.address })
    if(existingAddress){
        throw new AppError("The building address is already used", 409)
    }

    const user = userService.getUserById(creatorId)
    if(user.building_id){
        throw new AppError("You already are in a building", 409)
    }

    user.building_id = buildingId
    user.building_role = "owner"
    user.codeAttempts = 0

    user.save()

    const existingCreatorId = Building.findOne({ creatorId: data.creatorId })
    if(existingCreatorId){
        throw new AppError("You already created a building", 409)
    }

    hashedPassword = await bcrypt.hash(data.password, 10)

    return await Building.create({
        id: counter.value,
        name: data.name,
        description: data.description,
        address: data.address,
        area: data.area,
        creatorId: creatorId,
        password: hashedPassword
    })
}

exports.updateBuilding = async (id, data) => {
    const building = Building.findOne({ id: id })
    buildingNotFound(building)

    if(data.description){
        building.description = data.description
    }

    if(data.area){
        building.description = data.description
    }

    if(data.password){
        building.password = await bcrypt.hash(data.password, 10)
    }

    return await building.save()
}

exports.deleteBuildingById = async (id, data) => {
    const building = await Building.findOneAndDelete({ id: id })
    return checkBuilding(building)
}