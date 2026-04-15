const { ZodError } = require('zod')
const { registerShema, loginSchema } = require('./auth.validation')
const { registerUser, loginUser } = require('./auth.service')

async function register(req, res) {
  try {
    const parsed = registerShema.parse(req.body)
    const result = await registerUser(parsed)
    // TODO: Rate limiting
    // TODO: Email verification link
    // TODO: disposable email domains block (optional.com, tempmail.com etc)

    console.log('controller result', result)

    return res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        }
      })
    }
    if (error.message && error.message.includes('Email already registered')) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Email already registered'
        }
      })
    }
  }
}

function login(req, res, next) {
  try {
    const parsed = loginSchema.parse(req.body)
    const result = loginUser(parsed)

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Login successfully'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        }
      })
    }
    return next(error)
  }
}

module.exports = { register, login }
