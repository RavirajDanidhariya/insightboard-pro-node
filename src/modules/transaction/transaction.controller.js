const {
  getTransactionFiltersService,
  getTransactionByIdService,
  listTransactionsService
} = require('./transaction.service')

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

const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }

    const { id: transactionId } = req.params
    const data = await getTransactionByIdService({ userId, transactionId })

    return res.status(200).json({
      success: true,
      data,
      message: 'Transaction fetched successfully'
    })
  } catch (error) {
    return next(error)
  }
}

async function listTransactions(req, res, next) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      })
    }
    const result = await listTransactionsService({
      userId,
      query: req.query
    })
    return res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getTransactionFilters,
  getTransactionById,
  listTransactions
}
