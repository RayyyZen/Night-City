const buildingService = require('../services/buildingService')
const userService = require('../services/userService')

exports.getAllBuildings = async (req, res) => {
    const buildings = await buildingService.getAllBuildings()
    res.json(buildings)
}

exports.getBuildingById = async (req, res) => {
    const building = await buildingService.getBuildingById(req.params.id)
    if(!building){
        return res.status(404).json({ message: "Building not found" })
    }
    res.json(building)
}

exports.createBuilding = async (req, res) => {
    const b2 = await buildingService.getBuildingByName(req.body.name)
    if(b2){
        return res.status(401).json({ message: "A building with the same name already exists" })
    }

    const b1 = await buildingService.getBuildingByAddress(req.body.address)
    if(b1){
        return res.status(401).json({ message: "A building with the same address already exists" })
    }

    const b3 = await buildingService.getBuildingByCreatorId(req.session.user.id)
    if(b3){
        return res.status(401).json({ message: "You already created a building" })
    }

    const building = await buildingService.createBuilding(req.body,req.session.user.id)

    if(!building){
        return res.status(401).json({ message: "The building couldn't be created" })
    }

    const user = userService.joinBuilding(req.session.user.id,building.id)
    if(!user){
        return res.status(401).json({ message: "User not found" })
    }
    
    req.session.user.building_id = building.id

    res.status(201).json(building)
}

exports.deleteBuilding = async (req, res) => {
    const building = await buildingService.deleteBuildingById(req.params.id)
    if(!building){
        return res.status(404).json({ message: "Building not found" })
    }
    res.json({ message: "Building deleted" })
}

exports.getMyBuilding = async (req, res) => {
    if(!req.session.user.building_id){
        return res.status(404).json({ message: "You don't belong to any building" })
    }

    const building = await buildingService.getBuildingById(req.session.user.building_id)
    if(!building){
        return res.status(404).json({ message: "Building not found" })
    }
    res.json(building)
}