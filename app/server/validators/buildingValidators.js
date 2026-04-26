const { body } = require('express-validator')

exports.createValidation = [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('address').notEmpty(),
    body('area').notEmpty().isInt({ min: 1 }),
    body('password').notEmpty()
]