const { getTransactionFiltersService } = require('./transaction.service')

async function getTransactionFilters(req, res, next) {
  try {
    const data = await getTransactionFiltersService()

    return res.status(200).json({
      success: true,
      data,
      message: 'Transaction filters fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getTransactionFilters
}
