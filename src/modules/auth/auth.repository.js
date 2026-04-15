const prisma = require('../../config/prisma')

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  })
}

async function createUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName
    }
  })
}

module.exports = {
  findUserByEmail,
  createUser
}
