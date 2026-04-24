const prisma = require('../../config/prisma')
const {
  parseDateStart,
  parseDateEnd,
  parseCsv
} = require('../../common/utils/pagination.utils')

const buildTransactionWhere = (userId, filters) => {
  const where = { userId }
  const statuses = parseCsv(
    Array.isArray(filters.status) ? filters.status.join(',') : filters.status
  ).map((v) => v.toUpperCase())
  const categories = parseCsv(
    Array.isArray(filters.category)
      ? filters.category.join(',')
      : filters.category
  ).map((v) => v.toUpperCase())
  if (statuses.length) where.status = { in: statuses }
  if (categories.length) where.category = { in: categories }
  const from = parseDateStart(filters.dateRange?.from)
  const to = parseDateEnd(filters.dateRange?.to)
  if (from || to) {
    where.transactionDate = {}
    if (from) where.transactionDate.gte = from
    if (to) where.transactionDate.lte = to
  }
  return where
}

const fetchTransactionsForExport = async (userId, filters, limit = null) => {
  const where = buildTransactionWhere(userId, filters)
  return prisma.transaction.findMany({
    where,
    orderBy: { transactionDate: 'desc' },
    ...(limit ? { take: limit } : {}),
    select: {
      transactionId: true,
      customerName: true,
      productName: true,
      amount: true,
      currency: true,
      status: true,
      type: true,
      category: true,
      paymentMethod: true,
      country: true,
      transactionDate: true
    }
  })
}

const countTransactionsForExport = async (userId, filters) => {
  const where = buildTransactionWhere(userId, filters)
  return prisma.transaction.count({ where })
}

const createExportRecord = async ({
  userId,
  name,
  format,
  recordCount,
  filters,
  fileContent,
  expiresAt
}) => {
  return prisma.export.create({
    data: {
      userId,
      name,
      format,
      recordCount,
      filters,
      fileContent,
      expiresAt,
      status: 'ready'
    }
  })
}

const findExportsByUser = async (userId, limit, offset) => {
  const [records, total] = await Promise.all([
    prisma.export.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        format: true,
        status: true,
        recordCount: true,
        expiresAt: true,
        createdAt: true
      }
    }),
    prisma.export.count({ where: { userId } })
  ])
  return { records, total }
}

const findExportById = async (id, userId) => {
  return prisma.export.findFirst({
    where: { id, userId }
  })
}

const deleteExportById = async (id, userId) => {
  return prisma.export.deleteMany({
    where: { id, userId }
  })
}

module.exports = {
  fetchTransactionsForExport,
  countTransactionsForExport,
  createExportRecord,
  findExportsByUser,
  findExportById,
  deleteExportById
}
