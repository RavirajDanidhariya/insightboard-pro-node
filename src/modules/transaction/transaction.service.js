const {
  getTransactionFiltersRepository,
  getTransactionByIdRepository,
  listTransactionsRepository
} = require('./transaction.repository')

async function getTransactionFiltersService() {
  const filters = await getTransactionFiltersRepository()

  return {
    statuses: filters.statuses || [],
    categories: filters.categories || [],
    paymentMethods: filters.paymentMethods || [],
    types: filters.types || [],
    countries: filters.countries || []
  }
}

const getTransactionByIdService = async ({ userId, transactionId }) => {
  const parsed = parseInt(transactionId, 10)
  if (Number.isNaN(parsed) || parsed < 0) {
    const error = new Error('Invalid transaction ID')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  const transaction = await getTransactionByIdRepository({
    userId,
    transactionId
  })

  if (!transaction) {
    const error = new Error('Transaction not found')
    error.statusCode = 404
    error.code = 'NOT_FOUND'
    throw error
  }

  return transaction
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
async function listTransactionsService({ userId, query }) {
  assertDate(query.dateFrom, 'dateFrom')
  assertDate(query.dateTo, 'dateTo')
  if (
    query.dateFrom &&
    query.dateTo &&
    new Date(query.dateFrom) > new Date(query.dateTo)
  ) {
    const error = new Error('dateFrom cannot be greater than dateTo')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }
  return listTransactionsRepository({ userId, query })
}

module.exports = {
  getTransactionFiltersService,
  getTransactionByIdService,
  listTransactionsService
}
