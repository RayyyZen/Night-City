const { body } = require('express-validator')

exports.createNewsValidation = [
    body('title').notEmpty(),
    body('content').notEmpty()
]