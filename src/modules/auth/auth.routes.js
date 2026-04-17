const express = require('express')

const {
  register,
  login,
  getRefreshedAuthToken,
  logout,
  getCurrentUser
} = require('./auth.controller')
const { requireAuth } = require('../../common/middleware/auth.middleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/refresh', getRefreshedAuthToken)
router.post('/logout', logout)
router.get('/me', requireAuth, getCurrentUser)

module.exports = router
