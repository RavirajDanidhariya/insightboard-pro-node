// eslint-disable-next-line no-unused-vars
function errorHanlder(err, req, res, next) {
  console.error(`=== [ERROR] ===  ${err.code} -> ${err.message}`)
  console.error(err.stack)

  const status = err.status || 500
  const code = err.code || 'INTERNAL_SERVER_ERROR'
  const message = err.message || 'Internal server error'

  return res
    .status(status)
    .json({ success: false, code, message, details: err.details || null })
}

module.exports = { errorHanlder }
