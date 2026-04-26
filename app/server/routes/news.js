const express = require('express')
const router = express.Router()
const newsController = require('../controllers/newsController')

const userMiddlewares = require('../middlewares/userMiddlewares')
const validate = require('../middlewares/validation')

const newsValidators = require('../validators/newsValidators')

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

router.get('/mybuilding-news', userMiddlewares.auth, userMiddlewares.hasBuilding, newsController.getMyBuildingNews)
router.get('/mynews', userMiddlewares.auth, newsController.getMyNews)
router.get('/', newsController.getAllNews)
router.get('/:id', newsController.getNewsById)
router.post('/', limiter, newsValidators.createNewsValidation, validate, userMiddlewares.auth, newsController.createNews)
router.delete('/:id', userMiddlewares.auth, userMiddlewares.isAdmin, newsController.deleteNews)

module.exports = router