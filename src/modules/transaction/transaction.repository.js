const prisma = require('../../config/prisma')

const {
  TransactionCategory,
  TransactionStatus,
  PaymentMethod,
  TransactionType
} = require('../../generated/prisma')

const {
  parsePagination,
  parseSort,
  parseCsv,
  parseDateStart,
  parseDateEnd,
  buildPagedResponse
} = require('../../common/utils/pagination.utils')

function toApiValue(value) {
  return String(value).toLowerCase()
}

async function getTransactionFiltersRepository() {
  const countryRows = await prisma.transaction.findMany({
    select: { country: true },
    distinct: ['country'],
    orderBy: { country: 'asc' }
  })

  const countries = countryRows.map((row) => row.country).filter(Boolean)

  return {
    statuses: Object.values(TransactionStatus).map(toApiValue),
    categories: Object.values(TransactionCategory).map(toApiValue),
    paymentMethods: Object.values(PaymentMethod).map(toApiValue),
    types: Object.values(TransactionType).map(toApiValue),
    countries
  }
}

const getTransactionByIdRepository = async ({ userId, transactionId }) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: parseInt(transactionId, 10),
      userId
    },
    select: {
      id: true,
      transactionId: true,
      customerName: true,
      productName: true,
      amount: true,
      status: true,
      type: true,
      category: true,
      paymentMethod: true,
      country: true,
      currency: true,
      transactionDate: true,
      createdAt: true
    }
  })

  if (!transaction) {
    return null
  }

  return {
    id: transaction.id,
    transactionId: transaction.transactionId,
    customerName: transaction.customerName,
    productName: transaction.productName,
    amount: Number(transaction.amount),
    status: String(transaction.status).toLowerCase(),
    type: String(transaction.type).toLowerCase(),
    category: String(transaction.category).toLowerCase(),
    paymentMethod: String(transaction.paymentMethod).toLowerCase(),
    country: transaction.country,
    currency: transaction.currency,
    transactionDate: transaction.transactionDate,
    createdAt: transaction.createdAt
  }
}

//

function toEnumList(csvValue) {
  return parseCsv(csvValue).map((v) => v.toUpperCase())
}
async function listTransactionsRepository({ userId, query }) {
  const { page, limit, skip, take } = parsePagination(query)
  const { sortBy, sortOrder } = parseSort(
    query,
    [
      'transactionDate',
      'amount',
      'createdAt',
      'customerName',
      'productName',
      'transactionId'
    ],
    { sortBy: 'transactionDate', sortOrder: 'desc' }
  )

  const statuses = toEnumList(query.status)
  const categories = toEnumList(query.category)
  const paymentMethods = toEnumList(query.paymentMethod)
  const countries = parseCsv(query.country)
  const types = toEnumList(query.type)
  const from = parseDateStart(query.dateFrom)
  const to = parseDateEnd(query.dateTo)
  const search = String(query.search || '').trim()

  const where = { userId }

  if (statuses.length) where.status = { in: statuses }
  if (categories.length) where.category = { in: categories }
  if (paymentMethods.length) where.paymentMethod = { in: paymentMethods }
  if (countries.length) where.country = { in: countries }
  if (types.length) where.type = { in: types }
  if (from || to) {
    where.transactionDate = {}
    if (from) where.transactionDate.gte = from
    if (to) where.transactionDate.lte = to
  }
  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { productName: { contains: search, mode: 'insensitive' } }
    ]
  }
  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      select: {
        id: true,
        transactionId: true,
        customerName: true,
        productName: true,
        amount: true,
        status: true,
        type: true,
        category: true,
        paymentMethod: true,
        country: true,
        transactionDate: true
      }
    }),
    prisma.transaction.count({ where })
  ])

  const data = rows.map((row) => ({
    id: row.id,
    transactionId: row.transactionId,
    customerName: row.customerName,
    productName: row.productName,
    amount: Number(row.amount),
    status: String(row.status).toLowerCase(),
    type: String(row.type).toLowerCase(),
    category: String(row.category).toLowerCase(),
    paymentMethod: String(row.paymentMethod).toLowerCase(),
    country: row.country,
    date: row.transactionDate
  }))
  return buildPagedResponse(data, total, page, limit)
}

module.exports = {
  getTransactionFiltersRepository,
  getTransactionByIdRepository,
  listTransactionsRepository
}
