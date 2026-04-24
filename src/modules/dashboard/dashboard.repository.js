const prisma = require('../../config/prisma')

function buildDateWhere(dateFrom, dateTo) {
  const where = {}

  if (dateFrom || dateTo) {
    where.transactionDate = {}

    if (dateFrom) where.transactionDate.gte = new Date(dateFrom)
    if (dateTo) where.transactionDate.lte = new Date(dateTo)
  }

  return where
}

function decimalToNumber(value) {
  if (value === null || value === undefined) return 0
  return Number(value)
}

async function getDashboardMetricsRepository({ userId, dateFrom, dateTo }) {
  const where = {
    userId,
    ...buildDateWhere(dateFrom, dateTo)
  }

  const [aggregate, statusGroups] = await Promise.all([
    prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _avg: { amount: true },
      _count: { id: true }
    }),
    prisma.transaction.groupBy({
      by: ['status'],
      where,
      _count: { _all: true }
    })
  ])

  const statusCountMap = {
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    cancelledCount: 0
  }

  for (const row of statusGroups) {
    const status = String(row.status).toUpperCase()

    if (status === 'COMPLETED') statusCountMap.completedCount = row._count._all
    if (status === 'PENDING') statusCountMap.pendingCount = row._count._all
    if (status === 'FAILED') statusCountMap.failedCount = row._count._all
    if (status === 'CANCELLED') statusCountMap.cancelledCount = row._count._all
  }

  return {
    totalRevenue: decimalToNumber(aggregate._sum.amount),
    totalTransactions: aggregate._count.id || 0,
    averageOrderValue: decimalToNumber(aggregate._avg.amount),
    ...statusCountMap
  }
}

function ensureDate(value, type) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null

  if (type === 'from') {
    d.setHours(0, 0, 0, 0)
  } else if (type === 'to') {
    d.setHours(23, 59, 59, 999)
  }
  return d
}

function toNumber(v) {
  if (v === null || v === undefined) return 0
  return Number(v)
}

function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getUTCDay() // 0 = sun
  const diff = day === 0 ? -6 : 1 // Monday start
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function formatPeriod(date, groupBy) {
  const d = new Date(date)
  if (groupBy === 'day') return d.toISOString().slice(0, 10)
  if (groupBy === 'week') return getWeekStart(d).toISOString().slice(0, 10)

  return d.toISOString().slice(0, 7) // month
}

async function getRevenueTrendRepository({
  userId,
  dateFrom,
  dateTo,
  groupBy
}) {
  const where = { userId }

  const from = ensureDate(dateFrom, 'from')
  const to = ensureDate(dateTo, 'to')

  if (from || to) {
    where.transactionDate = {}

    if (from) where.transactionDate.gte = from
    if (to) where.transactionDate.lte = to
  }

  const rows = await prisma.transaction.findMany({
    where,
    select: {
      amount: true,
      transactionDate: true
    },
    orderBy: { transactionDate: 'asc' }
  })

  const map = new Map()

  for (const row of rows) {
    const key = formatPeriod(row.transactionDate, groupBy)
    const prev = map.get(key) || { period: key, revenue: 0, count: 0 }
    prev.revenue += toNumber(row.amount)
    prev.count += 1
    map.set(key, prev)
  }

  return Array.from(
    map.values().map((x) => {
      return {
        period: x.period,
        revenue: Number(x.revenue.toFixed(2)),
        count: x.count
      }
    })
  )
}

async function getCategoryBreakdownRepository({ userId, dateFrom, dateTo }) {
  const where = { userId }

  const from = ensureDate(dateFrom, 'from')
  const to = ensureDate(dateTo, 'to')
  if (from || to) {
    where.transactionDate = {}

    if (from) where.transactionDate.gte = from
    if (to) where.transactionDate.lte = to
  }

  const rows = await prisma.transaction.groupBy({
    by: ['category'],
    where,
    _sum: { amount: true },
    _count: { _all: true },
    orderBy: { _sum: { amount: 'desc' } }
  })

  const totalRevenue = rows.reduce(
    (sum, row) => sum + toNumber(row._sum.amount),
    0
  )

  return rows.map((row) => {
    const revenue = toNumber(row._sum.amount)
    const percentage = totalRevenue
      ? Number(((revenue / totalRevenue) * 100).toFixed(2))
      : 0

    return {
      category: String(row.category).toLowerCase(),
      revenue: Number(revenue.toFixed(2)),
      transactionCount: row._count.all,
      percentage
    }
  })
}

async function getStatusDistrubutionRepository({ userId, dateFrom, dateTo }) {
  const where = { userId }

  const from = ensureDate(dateFrom, 'from')
  const to = ensureDate(dateTo, 'to')

  if (from || to) {
    where.transactionDate = {}

    if (from) where.transactionDate.gte = from
    if (to) where.transactionDate.lte = to
  }

  const rows = await prisma.transaction.groupBy({
    by: ['status'],
    where,
    _sum: { amount: true },
    _count: { _all: true },
    orderBy: { status: 'desc' }
  })

  return rows.map((row) => {
    return {
      status: String(row.status).toLowerCase(),
      count: row._count.all,
      amount: Number(toNumber(row._sum.amount).toFixed(2))
    }
  })
}

module.exports = {
  getDashboardMetricsRepository,
  getRevenueTrendRepository,
  getCategoryBreakdownRepository,
  getStatusDistrubutionRepository
}
