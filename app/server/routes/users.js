const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

const userMiddlewares = require('../middlewares/userMiddlewares')
const validate = require('../middlewares/validation')

const userValidators = require('../validators/userValidators')

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

router.post('/log-out', userMiddlewares.auth, userController.logOut)
router.post('/register', limiter, userValidators.registerValidation, validate, userMiddlewares.isLogged, userController.register)
router.post('/login', limiter, userValidators.loginValidation, validate, userMiddlewares.isLogged, userController.login)
router.post('/verify-code', limiter, userValidators.codeValidation, validate, userMiddlewares.pendingUser, userController.verifyCode)
router.post('/resend-code', limiter, userMiddlewares.pendingUser, userController.resendCode)
router.get('/session', userController.session)
router.get('/profile', userMiddlewares.auth, userController.myProfile)
router.get('/profile/:id', userMiddlewares.auth, userController.publicProfile)
router.get('/', userMiddlewares.auth, userMiddlewares.isAdmin, userController.getAllUsers)
router.get('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, userController.getUserById)
router.post('/', limiter, userValidators.registerValidation, validate, userMiddlewares.auth, userMiddlewares.isAdmin, userController.createUser)
router.delete('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, userController.deleteUser)
router.put('/update', limiter, userMiddlewares.auth, userController.updateProfile)
router.put('/update/:id', limiter, userMiddlewares.auth, userMiddlewares.isAdmin, userController.updateUser)

router.post('/join-building/:id', limiter, userMiddlewares.auth, userController.joinBuilding)
router.post('/update-building-role/:id', limiter, userValidators.buildingRoleValidation, validate, userMiddlewares.auth, userController.updateBuildingRole)
router.post('/kick/:id', limiter, userMiddlewares.auth, userController.kickFromBuilding)

module.exports = router