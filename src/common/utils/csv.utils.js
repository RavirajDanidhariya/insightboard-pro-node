const CSV_HEADERS = [
  'Transaction ID',
  'Customer Name',
  'Product Name',
  'Amount',
  'Currency',
  'Status',
  'Type',
  'Category',
  'Payment Method',
  'Country',
  'Date'
]
const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}
const transactionToCsvRow = (tx) => {
  return [
    tx.transactionId,
    tx.customerName,
    tx.productName,
    tx.amount,
    tx.currency || 'INR',
    tx.status,
    tx.type,
    tx.category,
    tx.paymentMethod,
    tx.country,
    tx.transactionDate
      ? new Date(tx.transactionDate).toISOString().slice(0, 10)
      : ''
  ]
    .map(escapeCsvValue)
    .join(',')
}
const generateCsvContent = (transactions) => {
  const header = CSV_HEADERS.join(',')
  const rows = transactions.map(transactionToCsvRow)
  return [header, ...rows].join('\n')
}
module.exports = {
  generateCsvContent,
  CSV_HEADERS
}
