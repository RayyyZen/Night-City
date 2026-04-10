const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0
  }
})

module.exports = mongoose.model('User', userSchema)