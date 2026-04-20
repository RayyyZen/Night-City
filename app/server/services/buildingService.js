const Building = require('../models/Building')
const User = require('../models/User')
const Counter = require('../models/Counter')

exports.getAllBuildings = async () => {
    try{
        return await Building.find()
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getBuildingById = async (id) => {
    try{
        return await Building.findOne({ id: id })
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.createBuilding = async (data, creatorId) => {
    try{
        const counter = await Counter.findOneAndUpdate(
        { name: "buildingLastId" },
        { $inc: { value: 1 } },
        { returnDocument: "after", upsert: true }
        )

        if(!data || !data.name || !data.address || !data.area || !creatorId){
            throw new Error("The data fields are not complete to create the building")
        }

        return await Building.create({
            id: counter.value,
            name: data.name,
            address: data.address,
            area: data.area,
            creatorId: creatorId
        })
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.deleteBuildingById = async (id, data) => {
    try{
        return await Building.findOneAndDelete({ id: id })
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getBuildingByAddress = async (address) => {
    try{
        return await Building.findOne({ address: address })
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getBuildingByName = async (name) => {
    try{
        return await Building.findOne({ name: name })
    } catch (err) {
        console.error(err)
        return null
    }
}

exports.getBuildingByCreatorId = async (creatorId) => {
    try{
        return await Building.findOne({ creatorId: creatorId })
    } catch (err) {
        console.error(err)
        return null
    }
}