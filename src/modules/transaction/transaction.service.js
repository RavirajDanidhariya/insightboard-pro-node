const { getTransactionFiltersRepository } = require('./transaction.repository')

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

module.exports = {
  getTransactionFiltersService
}
