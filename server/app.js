require('dotenv').config()

const cors = require('cors')

const express = require('express')
const app = express()

const session = require('express-session')

//I don't actually need the cors because both the frontend and backend are running on the same origin (http://localhost with nginx), but before that it was two origins (http://localhost:5173 and http://localhost:3000)
//So I could delete this part of code
app.use(cors({
  origin: 'http://localhost',
  credentials: true
}))

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true if HTTPS
    maxAge: 1000 * 60 * 60 // 1h
  }
}))

const connectDB = require('./config/db')

connectDB()

const userRoutes = require('./routes/users')
const buildingRoutes = require('./routes/buildings')
const newsRoutes = require('./routes/news')
const deviceRoutes = require('./routes/devices')

app.use('/api/users', userRoutes)
app.use('/api/buildings', buildingRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/devices', deviceRoutes)

app.use('/api/uploads', express.static('uploads'))

app.get('/api/health', (req, res) => res.sendStatus(200))

const port = 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})