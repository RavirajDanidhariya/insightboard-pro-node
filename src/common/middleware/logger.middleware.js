function requestLogger(req, res, next) {
  const startTime = Date.now()
  const method = req.method
  const url = req.originalUrl

  const userContext = req?.user ? `userID: ${req.user.id}` : 'anonymous'

  // Sanitize body (remove passwords, tokens)

  const sanizedBody = sanitizedData(req.body)

  console.log(
    `REQUEST  [${new Date().toISOString()}]  ${method} ${url} | ${userContext}`
  )

  if (sanizedBody && Object?.keys?.(sanizedBody)?.length > 0) {
    console.log(`   Body:`, sanizedBody)
  }

  //   Capture original res.json to log response

  const originalJson = res.json.bind(res)

  res.json = function (data) {
    const duration = Date.now() - startTime
    console.log(
      `RESPONSE [${new Date().toISOString()}]  ${res.statusCode} ${method} ${url} | ${duration}ms`
    )
    return originalJson(data)
  }

  next()
}

function sanitizedData(data) {
  if (!data || typeof data !== 'object') return data

  const sanitized = { ...data }
  const sensitiveKeys = [
    'password',
    'passwordHash',
    'accessToken',
    'refreshToken',
    'token'
  ]

  sensitiveKeys.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = '***RESTRICTED***'
    }
  })

  return sanitized
}

module.exports = { requestLogger }
