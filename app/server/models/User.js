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
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('User', userSchema)