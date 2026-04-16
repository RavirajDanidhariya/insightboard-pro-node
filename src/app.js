const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const healthRouter = require('./modules/health/health.routes')
const authRouter = require('./modules/auth/auth.routes')
// Build in middleware

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
  })
)
// express.json() => It recognizes the incoming Request Object as a JSON object and converts the raw request body into a JavaScript object.
app.use(express.json())

// express.urlencoded({ extended: true }) => It extracts data sent via HTML forms (standard application/x-www-form-urlencoded format) and makes it available as a JavaScript object in req.body.
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// api routes
app.use('/health', healthRouter)
app.use('/api/v1/auth', authRouter)

module.exports = app
