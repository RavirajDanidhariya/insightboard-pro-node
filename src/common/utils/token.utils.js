const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

function generateRefreshToken(user) {
  return jwt.sign({ sub: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  })
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

function getRefreshExpiryDate() {
  const now = Date.now()
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  return new Date(now + sevenDaysMs)
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshExpiryDate
}
