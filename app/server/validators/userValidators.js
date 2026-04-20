const { body } = require('express-validator')

exports.registerValidation = [
    body('image').notEmpty(),
    body('gender').notEmpty(),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('nickName').notEmpty(),
    body('birthdate').notEmpty().isISO8601(),
    body('email').isEmail(),
    body('password').notEmpty()
]

exports.loginValidation = [
    body('email').isEmail(),
    body('password').notEmpty()
]

exports.codeValidation = [
    body('code').notEmpty().isInt({ min: 1 })
]

exports.buildingRoleValidation = [
    body('building_role').notEmpty()
]