function registerUser(input) {
  return {
    user: {
      id: 1,
      email: input.email,
      displayName: input.displayName
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
