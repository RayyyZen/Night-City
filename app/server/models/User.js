const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0
  },
  building_id: {
    type: Number,
    min: 0
  },
  building_role: {
    type: String,
  },
  image: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  nickName: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "user"
  },
  level: {
    type: String,
    required: true,
    default: "beginner"
  },
  points: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  lastTimeOnline: {
    type: Date,
    required: true,
    default: Date.now()
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  verificationCode: {
    type: String
  },
  codeExpiresAt: {
    type: Date
  },
  codeAttempts: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)