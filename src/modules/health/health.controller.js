function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    service: 'insightboard-api',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  })
}

module.exports = { getHealth }
