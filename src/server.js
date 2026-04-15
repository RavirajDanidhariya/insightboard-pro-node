const app = require('./app')

require('dotenv').config()

const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
