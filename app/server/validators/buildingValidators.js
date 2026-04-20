const { body } = require('express-validator')

exports.createValidation = [
    body('name').notEmpty(),
    body('address').notEmpty(),
    body('area').notEmpty().isInt({ min: 1 })
]