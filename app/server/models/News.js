const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        min: 0
    },
    building_id: {
        type: Number,
        required: true,
        min: 0
    },
    author_id: {
        type: Number,
        required: true,
        min: 0
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('News', newsSchema)