const express = require('express')
const router = express.Router()
const buildingController = require('../controllers/buildingController')

const userMiddlewares = require('../middlewares/userMiddlewares')
const validate = require('../middlewares/validation')

const buildingValidators = require('../validators/buildingValidators')

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

router.get('/mybuilding', userMiddlewares.auth, buildingController.getMyBuilding)
router.get('/', buildingController.getAllBuildings)
router.get('/:id', buildingController.getPublicBuildingById)
router.post('/', limiter, buildingValidators.createValidation, validate, userMiddlewares.auth, buildingController.createBuilding)
router.put('/', userMiddlewares.auth, userMiddlewares.isOwner, buildingController.updateBuilding)
router.delete('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, buildingController.deleteBuilding)

module.exports = router