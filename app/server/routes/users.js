const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const User = require('../models/User')

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.post('/login', userController.login)

/*
const bcrypt = require('bcrypt')

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).send("User not found")
    }

    const isMatch = await bcrypt.compare(req.body.mdp, user.mdp)

    if (!isMatch) {
        return res.status(401).send("Wrong password")
    }

    req.session.user = {
        id: user.id,
        role: user.role
    }

    res.send("Logged in")
})
*/

module.exports = router