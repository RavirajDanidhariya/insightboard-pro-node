const {
  getDashboardMetricsService,
  getRevenueTrendService,
  getCategoryBreakdownService,
  getStatusDistrubutionService,
  getRegionBreakdownService
} = require('./dashboard.service')

async function getDashboardMetrics(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }

    const { dateFrom, dateTo } = req.query

    const data = await getDashboardMetricsService({
      userId,
      dateFrom,
      dateTo
    })

    return res.status(200).json({
      success: true,
      data,
      message: 'Dashboard Metrics fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

async function getRevenueTrend(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }

    const { dateFrom, dateTo, groupBy } = req.query

    const data = await getRevenueTrendService({
      userId,
      dateFrom,
      dateTo,
      groupBy
    })

    return res.status(200).json({
      success: true,
      data,
      message: 'Revenue trend fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

//

async function getCategoryBreakdown(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }

    const { dateFrom, dateTo } = req.query

    const data = await getCategoryBreakdownService({
      userId,
      dateFrom,
      dateTo
    })

    return res.status(200).json({
      success: true,
      data,
      message: 'Category breakdown fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

//

async function getStatusDistrubution(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }

    const { dateFrom, dateTo } = req.query
    const data = await getStatusDistrubutionService({
      userId,
      dateFrom,
      dateTo
    })

    return res.status(200).json({
      success: true,
      data,
      message: 'Status distribution fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

//

async function getRegionBreakdown(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }

    const { dateFrom, dateTo } = req.query

    const data = await getRegionBreakdownService({
      userId,
      dateFrom,
      dateTo
    })

    return res.status(200).json({
      success: true,
      data,
      message: 'Category breakdown fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getDashboardMetrics,
  getRevenueTrend,
  getCategoryBreakdown,
  getStatusDistrubution,
  getRegionBreakdown
}
