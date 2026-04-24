const express = require('express')
const { requireAuth } = require('../../common/middleware/auth.middleware')
const {
  getDashboardMetrics,
  getRevenueTrend,
  getCategoryBreakdown,
  getStatusDistrubution
} = require('./dashboard.controller')

const router = express.Router()

router.get('/metrics', requireAuth, getDashboardMetrics)
router.get('/revenue-trend', requireAuth, getRevenueTrend)
router.get('/category-breakdown', requireAuth, getCategoryBreakdown)
router.get('/status-distribution', requireAuth, getStatusDistrubution)

module.exports = router
