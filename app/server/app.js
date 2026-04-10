require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT
const connectDB = require('./config/db')

connectDB()

const userRoutes = require('./routes/users')

app.use('/users', userRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})