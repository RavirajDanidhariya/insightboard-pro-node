const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME
const ACCESS_COOKIE_NAME = process.env.ACCESS_COOKIE_NAME

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'node' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const refreshCookieClearOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'node' : 'lax',
  path: '/'
}

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'node' : 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000 // 15 minutes
}

const accessTokenCookieClearOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'node' : 'lax',
  path: '/'
}

module.exports = {
  REFRESH_COOKIE_NAME,
  ACCESS_COOKIE_NAME,
  refreshCookieClearOptions,
  refreshCookieOptions,
  accessTokenCookieOptions,
  accessTokenCookieClearOptions
}
