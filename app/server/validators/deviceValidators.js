const { body } = require('express-validator')

exports.createDeviceValidation = [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('energy').notEmpty().isInt({ min: 0 })
]