const { PrismaClient } = require('./src/generated/prisma')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = `${process.env.DATABASE_URL}`

async function main() {
  const adapter = new PrismaPg({ connectionString })

  const prisma = new PrismaClient({ adapter })

  try {
    await prisma.$connect()
    console.log('prisma client connected ok')
  } catch (err) {
    console.log('prisma client error', err)
  }
}

main()
