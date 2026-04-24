const { PrismaClient } = require('../../src/generated/prisma')
const { PrismaPg } = require('@prisma/adapter-pg')

require('dotenv').config()

const {
  CATEGORIES,
  COUNTRIES,
  CUSTOMER_NAMES,
  PAYMENT_METHODS,
  PRODUCT_BY_CATEGORY,
  SEED_SETTINGS,
  STATUS_WEIGHTS,
  TYPE_WEIGHTS
} = require('./transactionSeed.config')

console.log('Seed script started')

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is missing in .env')
}

const adapter = new PrismaPg({ connectionString })

const prisma = new PrismaClient({ adapter })

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randomAmount() {
  return Number((100 + Math.random() * 5000).toFixed(2))
}
function randomDateWithin(daysBack) {
  const now = Date.now()
  const past = now - daysBack * 24 * 60 * 60 * 1000
  const ts = past + Math.floor(Math.random() * (now - past))
  return new Date(ts)
}
function buildTransactionId(userId, index) {
  const year = new Date().getFullYear()
  return `TXN-${year}-${String(userId).padStart(2, '0')}-${String(index).padStart(4, '0')}`
}
async function seedTransactions() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is blocked in production.')
  }
  const users = await prisma.user.findMany({
    select: { id: true, email: true, displayName: true },
    orderBy: { id: 'asc' }
  })
  if (!users.length) {
    throw new Error('No users found. Create users first.')
  }
  if (
    !Number.isInteger(SEED_SETTINGS.totalPerUser) ||
    SEED_SETTINGS.totalPerUser <= 0
  ) {
    throw new Error('Invalid totalPerUser in config.')
  }
  if (
    !Number.isInteger(SEED_SETTINGS.lookbackDays) ||
    SEED_SETTINGS.lookbackDays <= 0
  ) {
    throw new Error('Invalid lookbackDays in config.')
  }
  if (SEED_SETTINGS.resetBeforeSeed) {
    const deleted = await prisma.transaction.deleteMany({})
    console.log(`Deleted existing transactions: ${deleted.count}`)
  }
  const statuses = STATUS_WEIGHTS.map((s) => s.value)
  const types = TYPE_WEIGHTS.map((t) => t.value)
  const rows = []
  for (const user of users) {
    for (let i = 1; i <= SEED_SETTINGS.totalPerUser; i++) {
      const category = pickRandom(CATEGORIES)
      rows.push({
        userId: user.id,
        transactionId: buildTransactionId(user.id, i),
        customerName: pickRandom(CUSTOMER_NAMES),
        productName: pickRandom(PRODUCT_BY_CATEGORY[category]),
        amount: randomAmount(),
        currency: 'INR',
        status: pickRandom(statuses),
        type: pickRandom(types),
        category,
        paymentMethod: pickRandom(PAYMENT_METHODS),
        country: pickRandom(COUNTRIES),
        transactionDate: randomDateWithin(SEED_SETTINGS.lookbackDays)
      })
    }
  }
  const result = await prisma.transaction.createMany({
    data: rows,
    skipDuplicates: true
  })
  const total = await prisma.transaction.count()
  console.log(`Inserted now: ${result.count}`)
  console.log(`Seeding completed. Total transactions in DB: ${total}`)
}
seedTransactions()
  .catch((error) => {
    console.error('Transaction seed failed:', error.message)
    console.log('this is in error', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
