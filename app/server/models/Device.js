const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        min: 0
    },
    building_id: {
        type: Number,
        min: 0,
        required: true
    },
    user_id: {
        type: Number,
        min: 0
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "idle"
    },
    energy: {
        type: Number,
        required: true,
        min: 0
    },
    installationDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('Device', deviceSchema)