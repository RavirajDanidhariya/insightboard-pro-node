// common/utils/pagination.utils.js
const clamp = (number, min, max) => {
  return Math.min(Math.max(number, min), max)
}
const parsePagination = (
  query,
  defaults = { page: 1, limit: 20, maxLimit: 100 }
) => {
  const page = clamp(
    parseInt(query.page, 10) || defaults.page,
    1,
    Number.MAX_SAFE_INTEGER
  )
  const limit = clamp(
    parseInt(query.limit, 10) || defaults.limit,
    1,
    defaults.maxLimit
  )
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit
  }
}

const parseSort = (
  query,
  allowedFields,
  defaultSort = { sortBy: 'transactionDate', sortOrder: 'desc' }
) => {
  const requestedSortBy = query.sortBy
  const requestedSortOrder = String(
    query.sortOrder || defaultSort.sortOrder
  ).toLowerCase()
  const sortBy = allowedFields.includes(requestedSortBy)
    ? requestedSortBy
    : defaultSort.sortBy
  const sortOrder = requestedSortOrder === 'asc' ? 'asc' : 'desc'
  return { sortBy, sortOrder }
}

const parseCsv = (value) => {
  if (!value) return []
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

const parseDateStart = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  d.setUTCHours(0, 0, 0, 0)
  return d
}

const parseDateEnd = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  d.setUTCHours(23, 59, 59, 999)
  return d
}

const buildPagedResponse = (data, total, page, limit) => {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit)
    }
  }
}

module.exports = {
  parsePagination,
  parseSort,
  parseCsv,
  parseDateStart,
  parseDateEnd,
  buildPagedResponse
}
