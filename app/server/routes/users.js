const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const User = require('../models/User')

const userMiddlewares = require('../middlewares/userMiddlewares')
const validate = require('../middlewares/validation')

const userValidators = require('../validators/userValidators')

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

router.post('/register', limiter, userValidators.registerValidation, validate, userMiddlewares.isLogged, userController.register)
router.post('/login', limiter, userValidators.loginValidation, validate, userMiddlewares.isLogged, userController.login)
router.post('/verify-code', limiter, userValidators.codeValidation, validate, userMiddlewares.pendingUser, userController.verifyCode)
router.get('/session', userMiddlewares.auth, userController.session)
router.get('/profile', userMiddlewares.auth, userController.myProfile)
router.get('/profile/:id', userMiddlewares.auth, userController.publicProfile)
router.get('/', userMiddlewares.auth, userMiddlewares.isAdmin, userController.getAllUsers)
router.get('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, userController.getUserById)
router.post('/', limiter, userController.createUser)
router.put('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, userController.updateUser)
router.delete('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, userController.deleteUser)

module.exports = router