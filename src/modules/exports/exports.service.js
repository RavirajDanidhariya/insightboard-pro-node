const { randomUUID } = require('crypto')
const { generateCsvContent } = require('../../common/utils/csv.utils')
const {
  uploadCsvFile,
  downloadFileBuffer,
  deleteFile
} = require('../../common/utils/storage.utils')
const {
  fetchTransactionsForExport,
  countTransactionsForExport,
  createExportRecord,
  findExportsByUser,
  findExportById,
  deleteExportById
} = require('./exports.repository')

// Preview Export
const previewExportService = async (userId, body) => {
  const limit = Math.min(parseInt(body.limit, 10) || 100, 500)
  const filters = {
    status: body.status || '',
    category: body.category,
    dateRange: body.dateRange
  }
  const [transactions, totalCount] = await Promise.all([
    fetchTransactionsForExport(userId, filters, limit),
    countTransactionsForExport(userId, filters)
  ])
  const records = transactions.map((tx) => ({
    transactionId: tx.transactionId,
    customerName: tx.customerName,
    productName: tx.productName,
    amount: Number(tx.amount),
    status: String(tx.status).toLowerCase(),
    date: tx.transactionDate
      ? new Date(tx.transactionDate).toISOString().slice(0, 10)
      : null
  }))
  return { records, totalCount }
}

// Create Export
const createExportService = async (userId, body) => {
  const format = (body.format || 'csv').toLowerCase()
  if (format !== 'csv') {
    const error = new Error('Only csv format is supported')
    error.statusCode = 400
    error.code = 'VALIDATION_ERROR'
    throw error
  }
  const filters = {
    status: body.status,
    category: body.category,
    dateRange: body.dateRange
  }
  const transactions = await fetchTransactionsForExport(userId, filters)
  const fileContent = generateCsvContent(transactions)
  const recordCount = transactions.length
  const today = new Date().toISOString().slice(0, 10)
  const fileId = randomUUID()
  const storagePath = `users/${userId}/${fileId}.csv`
  const name = `Transactions_${today}.csv`
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await uploadCsvFile({
    path: storagePath,
    content: fileContent
  })
  const record = await createExportRecord({
    userId,
    name,
    format,
    recordCount,
    filters,
    fileContent,
    storagePath,
    expiresAt
  })
  return {
    exportId: record.id,
    name: record.name,
    status: record.status,
    recordCount: record.recordCount,
    downloadUrl: `/api/v1/exports/${record.id}/download`,
    expiresAt: record.expiresAt
  }
}

// Export History
const getExportHistoryService = async (userId, query) => {
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50)
  const offset = Math.max(parseInt(query.offset, 10) || 0, 0)
  const { records, total } = await findExportsByUser(userId, limit, offset)
  const data = records.map((r) => ({
    id: r.id,
    name: r.name,
    status: r.status,
    recordCount: r.recordCount,
    downloadUrl: `/api/v1/exports/${r.id}/download`,
    createdAt: r.createdAt
  }))
  return { data, meta: { total, limit, offset } }
}

// Download Export
const downloadExportService = async (userId, exportId) => {
  const record = await findExportById(exportId, userId)
  if (!record) {
    const error = new Error('Export not found')
    error.statusCode = 404
    error.code = 'NOT_FOUND'
    throw error
  }
  if (new Date() > new Date(record.expiresAt)) {
    const error = new Error('Export has expired')
    error.statusCode = 410
    error.code = 'EXPORT_EXPIRED'
    throw error
  }
  if (record.storagePath) {
    const fileBuffer = await downloadFileBuffer(record.storagePath)
    return {
      fileBuffer,
      name: record.name,
      format: record.format
    }
  }

  const error = new Error('Export file is missing')
  error.statusCode = 404
  error.code = 'EXPORT_FILE_MISSING'
  throw error
}
const deleteExportService = async (userId, exportId) => {
  const record = await findExportById(exportId, userId)
  if (!record) {
    const error = new Error('Export not found')
    error.statusCode = 404
    error.code = 'NOT_FOUND'
    throw error
  }
  if (record.storagePath) {
    await deleteFile(record.storagePath)
  }
  await deleteExportById(exportId, userId)
}
module.exports = {
  previewExportService,
  createExportService,
  getExportHistoryService,
  downloadExportService,
  deleteExportService
}
