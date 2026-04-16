const { ZodError } = require('zod')
const { registerShema, loginSchema } = require('./auth.validation')

const {
  registerUser,
  loginUser,
  refreshAuthToken,
  logoutUser,
  getCurrentUserProfile
} = require('./auth.service')

const {
  REFRESH_COOKIE_NAME,
  ACCESS_COOKIE_NAME,
  accessTokenCookieOptions,
  refreshCookieClearOptions,
  refreshCookieOptions,
  accessTokenCookieClearOptions
} = require('../../config/cookie.config')

function buildZodValidationError(error) {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request payload',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    }
  }
}

async function register(req, res) {
  try {
    const parsed = registerShema.parse(req.body)
    const result = await registerUser(parsed)
    // TODO: Rate limiting
    // TODO: Email verification link
    // TODO: disposable email domains block (optional.com, tempmail.com etc)

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions)
    res.cookie(ACCESS_COOKIE_NAME, result.accessToken, accessTokenCookieOptions)

    return res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(buildZodValidationError(error))
    }
    if (error.message && error.code.includes('EMAIL_CONFLICT')) {
      return res.status(409).json({
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      })
    }
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.parse(req.body)
    const result = await loginUser(parsed)

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions)
    res.cookie(ACCESS_COOKIE_NAME, result.accessToken, accessTokenCookieOptions)

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Login successfully'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(buildZodValidationError(error))
    }
    if (error.message && error.code.includes('INVALID_CREDENTIALS')) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      })
    }
    return next(error)
  }
}

async function getRefreshedAuthToken(req, res, next) {
  try {
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME]
    if (!incomingRefreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' })
    }
    const result = await refreshAuthToken(incomingRefreshToken)

    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, refreshCookieOptions)

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Token refreshed successfully'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(buildZodValidationError(error))
    }
    if (
      error.code === 'INVALID_REFRESH_TOKEN' ||
      error.code === 'REFRESH_TOKEN_EXPIRED'
    ) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: error.message }
      })
    }
    return next(error)
  }
}

async function logout(req, res, next) {
  try {
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME]
    console.log('incomingRefreshToken', incomingRefreshToken)
    if (incomingRefreshToken) {
      await logoutUser(incomingRefreshToken)
    }
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieClearOptions)
    res.clearCookie(ACCESS_COOKIE_NAME, accessTokenCookieClearOptions)

    return res.status(200).json({
      success: true,
      message: 'Logout successfully'
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(buildZodValidationError(error))
    }
    return next(error)
  }
}

async function getCurrentUser(req, res) {
  try {
    console.log(req.user)
    const userId = req.user.id
    const user = await getCurrentUserProfile(userId)

    return res.status(200).json({
      message: 'Profile fetched successfully',
      data: user
    })
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  register,
  login,
  getRefreshedAuthToken,
  logout,
  getCurrentUser
}
