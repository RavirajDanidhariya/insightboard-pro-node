const { findUserByEmail, createUser } = require('./auth.repository')

async function registerUser(input) {
  const existing = await findUserByEmail(input.email)

  if (existing) {
    throw new Error('Email already registered')
  }

  const user = await createUser({
    email: input.email,
    passwordHash: input.password,
    displayName: input.displayName
  })

  console.log('service saved user', user)

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName
    },
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token'
  }
}

function loginUser(input) {
  // mock behaviour for now
  return {
    user: {
      id: 1,
      email: input.email,
      displayName: 'Raviraj Danidhariya'
    },
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token'
  }
}

module.exports = {
  registerUser,
  loginUser
}
