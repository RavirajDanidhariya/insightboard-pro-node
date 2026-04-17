const bcrypt = require('bcryptjs')
const {
  findUserByEmail,
  findUserById,
  createUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken
} = require('./auth.repository')

const {
  generateAccessToken,
  generateRefreshToken,
  getRefreshExpiryDate,
  verifyRefreshToken
} = require('../../common/utils/token.utils')

async function registerUser(input) {
  const existing = await findUserByEmail(input.email)

  if (existing) {
    const error = new Error('Email already registered')
    error.code = 'EMAIL_CONFLICT'
    throw error
  }

  const passwordHash = await bcrypt.hash(input.password, 10)

  const user = await createUser({
    email: input.email,
    passwordHash,
    displayName: input.displayName
  })

  // const accessToken = generateAccessToken(user)
  // const refreshToken = generateRefreshToken(user)

  // await createRefreshToken({
  //   token: refreshToken,
  //   userId: user.id,
  //   expiresAt: getRefreshExpiryDate()
  // })

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    // accessToken,
    // refreshToken
  }
}

async function loginUser(input) {
  // mock behaviour for now

  const user = await findUserByEmail(input.email)

  if (!user) {
    const error = new Error('Invalid email or password')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.passwordHash
  )

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: getRefreshExpiryDate()
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName
    },
    accessToken,
    refreshToken
  }
}

async function refreshAuthToken(refreshToken) {
  const stored = await findRefreshToken(refreshToken)
  if (!stored) {
    const err = new Error('Invalid refresh token')
    err.code = 'INVALID_REFRESH_TOKEN'
    throw err
  }

  if (stored.expiresAt < new Date()) {
    await deleteRefreshToken(refreshToken)
    const err = new Error('Refresh token expired')
    err.code = 'REFRESH_TOKEN_EXPIRED'
    throw err
  }

  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    const err = new Error('Invalid refresh token')
    err.code = 'INVALID_REFRESH_TOKEN'
    throw err
  }

  const user = await findUserById(payload.sub)
  if (!user) {
    const err = new Error('User not found')
    err.code = 'USER_NOT_FOUND'
    throw err
  }

  const accessToken = generateAccessToken(user)
  return { accessToken }
}

async function logoutUser(refreshToken) {
  await deleteRefreshToken(refreshToken)
  return { message: 'Logged out successfully' }
}

async function getCurrentUserProfile(userId) {
  const user = await findUserById(userId)

  if (!user) {
    const err = new Error('User not found')
    err.code = 'USER_NOT_FOUND'
    throw err
  }

  return user
}

module.exports = {
  registerUser,
  loginUser,
  refreshAuthToken,
  logoutUser,
  getCurrentUserProfile
}
