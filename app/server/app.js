require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

const port = process.env.PORT
const connectDB = require('./config/db')

connectDB()

const userRoutes = require('./routes/users')

app.use('/users', userRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})