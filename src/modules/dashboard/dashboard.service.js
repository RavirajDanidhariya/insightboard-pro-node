const {
  getDashboardMetricsRepository,
  getRevenueTrendRepository,
  getCategoryBreakdownRepository,
  getStatusDistrubutionRepository,
  getRegionBreakdownRepository
} = require('./dashboard.repository')

function ensureValidate(dateValue, fieldName) {
  if (!dateValue) return
  const d = new Date(dateValue)

  if (Number.isNaN(d.getTime())) {
    const error = new Error(`${fieldName} must be a valid date`)
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }
}

async function getDashboardMetricsService({ userId, dateFrom, dateTo }) {
  ensureValidate(dateFrom, 'dateFrom')
  ensureValidate(dateFrom, 'dateTo')

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    const error = new Error('dateFrom cannot be greater than dateTo')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  return getDashboardMetricsRepository({
    userId,
    dateFrom,
    dateTo
  })
}

function assertDate(value, fieldName) {
  if (!value) return

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) {
    const error = new Error(`${fieldName} must be a valid date`)
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }
}

async function getRevenueTrendService({ userId, dateFrom, dateTo, groupBy }) {
  assertDate(dateFrom, 'dateFrom')
  assertDate(dateTo, 'dateTo')

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    const error = new Error('dateFrom cannot be greater than dateTo')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  const allowed = ['day', 'week', 'month']

  const normalizedGroupBy = (groupBy || 'month').toLowerCase()

  if (!allowed.includes(normalizedGroupBy)) {
    const error = new Error('groupBy must be one of: ' + allowed.join(', '))
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  return getRevenueTrendRepository({
    userId,
    dateFrom,
    dateTo,
    groupBy: normalizedGroupBy
  })
}

//

async function getCategoryBreakdownService({ userId, dateFrom, dateTo }) {
  assertDate(dateFrom, 'dateFrom')
  assertDate(dateTo, 'dateTo')

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    const error = new Error('dateFrom cannot be greater than dateTo')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }
  return getCategoryBreakdownRepository({ userId, dateFrom, dateTo })
}

async function getStatusDistrubutionService({ userId, dateFrom, dateTo }) {
  assertDate(dateFrom, 'dateFrom')
  assertDate(dateTo, 'dateTo')

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    const error = new Error('dateFrom cannot be greater than dateTo')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  return getStatusDistrubutionRepository({ userId, dateFrom, dateTo })
}

async function getRegionBreakdownService({ userId, dateFrom, dateTo }) {
  assertDate(dateFrom, 'dateFrom')
  assertDate(dateTo, 'dateTo')

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    const error = new Error('dateFrom cannot be greater than dateTo')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }
  return getRegionBreakdownRepository({ userId, dateFrom, dateTo })
}

module.exports = {
  getDashboardMetricsService,
  getRevenueTrendService,
  getCategoryBreakdownService,
  getStatusDistrubutionService,
  getRegionBreakdownService
}
