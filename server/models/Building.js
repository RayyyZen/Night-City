const mongoose = require('mongoose')

const buildingSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        min: 0
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: Number,
        required: true,
        min: 0
    },
    creatorId: {
        type: Number,
        required: true,
        unique: true,
        min: 0
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Building', buildingSchema)