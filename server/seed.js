require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')
const Counter = require('./models/Counter')

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO)

    const existing = await User.findOne({ email: 'admin@demo.com' })
    if (existing) {
      console.log('Admin already existing')
      await mongoose.disconnect()
      return process.exit(0)
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "userLastId" },
      { $inc: { value: 1 } },
      { returnDocument: "after", upsert: true }
    )

    await User.create({
        id: counter.value,
        image: 'uploads/default.png',
        gender: 'other',
        firstName: 'Admin',
        lastName: 'Demo',
        nickName: 'admin',
        birthdate: new Date('1990-01-01'),
        email: 'admin@demo.com',
        password: await bcrypt.hash('demo', 10),
        role: 'admin',
        isVerified: true
    })

    console.log('admin@demo.com / demo')
    await mongoose.disconnect()
    process.exit(0)

  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  }
}

seed()