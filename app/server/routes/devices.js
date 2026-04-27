const express = require('express')
const router = express.Router()
const deviceController = require('../controllers/deviceController')

const userMiddlewares = require('../middlewares/userMiddlewares')
const validate = require('../middlewares/validation')

const deviceValidators = require('../validators/deviceValidators')

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

router.get('/mybuilding-devices', userMiddlewares.auth, userMiddlewares.hasBuilding, deviceController.getMyBuildingDevices)
router.get('/', userMiddlewares.auth, userMiddlewares.isAdmin, deviceController.getAllDevices)
router.get('/:id', userMiddlewares.auth, userMiddlewares.hasBuilding, deviceController.getDeviceById)
router.post('/', limiter, deviceValidators.createDeviceValidation, validate, userMiddlewares.auth, userMiddlewares.isOwner, deviceController.createDevice)
router.put('/:id', userMiddlewares.auth, userMiddlewares.isOwner, deviceController.updateDevice)

router.post('/idle/:id', userMiddlewares.auth, deviceController.setDeviceIdle)
router.post('/in_use/:id', userMiddlewares.auth, deviceController.setDeviceUse)
router.post('/error/:id', userMiddlewares.auth, userMiddlewares.isOwner, deviceController.setDeviceError)

router.delete('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, deviceController.deleteDevice)

module.exports = router