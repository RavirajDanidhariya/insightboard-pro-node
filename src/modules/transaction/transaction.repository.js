const prisma = require('../../config/prisma')

const {
  TransactionCategory,
  TransactionStatus,
  PaymentMethod,
  TransactionType
} = require('../../generated/prisma')

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

module.exports = {
  getTransactionFiltersRepository
}
