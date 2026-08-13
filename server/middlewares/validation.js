const { validationResult } = require('express-validator')

function validate(req, res, next) {
  const errors = validationResult(req)

  const message = "Invalid value of fields"

  if (!errors.isEmpty()) {
    //return res.status(400).json(errors)
    return res.status(400).json({ message: message })
  }

  next()
}

module.exports = validate