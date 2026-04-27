require('dotenv').config()

const cors = require('cors')

const express = require('express')
const app = express()

const session = require('express-session')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true en HTTPS
    maxAge: 1000 * 60 * 60 // 1h
  }
}))

const port = process.env.PORT
const connectDB = require('./config/db')

connectDB()

const userRoutes = require('./routes/users')
const buildingRoutes = require('./routes/buildings')
const newsRoutes = require('./routes/news')
const deviceRoutes = require('./routes/devices')

app.use('/users', userRoutes)
app.use('/buildings', buildingRoutes)
app.use('/news', newsRoutes)
app.use('/devices', deviceRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

















app.use('/uploads', express.static('uploads'))