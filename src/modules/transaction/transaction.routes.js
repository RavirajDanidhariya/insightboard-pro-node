const express = require('express')
const {
  getTransactionFilters,
  getTransactionById,
  listTransactions
} = require('./transaction.controller')
const { requireAuth } = require('../../common/middleware/auth.middleware')

const router = express.Router()

router.get('/', requireAuth, listTransactions)
router.get('/filters', requireAuth, getTransactionFilters)
router.get('/:id', requireAuth, getTransactionById)

module.exports = router
