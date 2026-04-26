const buildingService = require('../services/buildingService')
const userService = require('../services/userService')

const AppError = require('../errors/AppError')

const errorHandler = (err, res) => {
    if(err instanceof AppError){
        return res.status(err.status).json({ message: err.message })
    }
    console.error(err)
    res.status(500).json({ message: "Server Error" })
}

exports.getAllBuildings = async (req, res) => {
    const buildings = await buildingService.getAllBuildings()
    res.json(buildings)
}

exports.getBuildingById = async (req, res) => {
    try{
        const building = await buildingService.getBuildingById(req.params.id)
        res.json(building)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.getPublicBuildingById = async (req, res) => {
    try{
        const building = await buildingService.getPublicBuildingById(req.params.id)
        res.json(building)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.getMyBuilding = async (req, res) => {
    try{
        const { building, users, devices } = await buildingService.getMyBuildingById(req.session.user.building_id)
        res.json({
            building: building,
            users: users,
            devices: devices
        })
    
    } catch(err) {
        errorHandler(err, res)
    }
}

exports.createBuilding = async (req, res) => {
    try{
        const building = await buildingService.createBuilding(req.body,req.session.user.id)
        
        req.session.user.building_id = building.id
        res.status(201).json(building)
    
    } catch(err) {
        errorHandler(err, res)
    }
}

exports.updateBuilding = async (req, res) => {
    try{
        const building = await buildingService.updateBuilding(req.session.user.building_id, req.body)
        res.json(building)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.deleteBuilding = async (req, res) => {
    try{
        const building = await buildingService.deleteBuildingById(req.params.id)
        res.json({ message: "Building deleted" })
    
    } catch(err) {
        errorHandler(err, res)
    }
}