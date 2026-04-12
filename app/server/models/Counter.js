const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  name: {
    type: String
  },
  value: {
    type: Number
  }
})

module.exports = mongoose.model('Counter', counterSchema)