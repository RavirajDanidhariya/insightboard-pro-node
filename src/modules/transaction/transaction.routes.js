const express = require('express')
const { getTransactionFilters } = require('./transaction.controller')
const { requireAuth } = require('../../common/middleware/auth.middleware')

const router = express.Router()

router.get('/filters', requireAuth, getTransactionFilters)

module.exports = router
