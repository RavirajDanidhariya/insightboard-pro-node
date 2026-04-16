const { ACCESS_COOKIE_NAME } = require('../../config/cookie.config')
const { verifyAccessToken } = require('../utils/token.utils')

function requireAuth(req, res, next) {
  // const authHeader = req.headers.authorization || ''
  // const [scheme, token] = authHeader.split(' ')

  // if (scheme !== 'Bearer' || !token) {
  //   return res.status(401).json({
  //     success: false,
  //     error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' }
  //   })
  // }

  try {
    const accessToken = req.cookies?.[ACCESS_COOKIE_NAME]

    if (!accessToken) {
      return res
        .status(401)
        .json({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
    }
    const payload = verifyAccessToken(accessToken)
    console.log('auth middleware user', payload)
    req.user = { id: payload.sub, email: payload.email }
    return next()
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token Verification failed' }
    })
  }
}

module.exports = { requireAuth }
