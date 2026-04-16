const prisma = require('../../config/prisma')

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  })
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true
    }
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

async function createRefreshToken(data) {
  return prisma.refreshToken.create({
    data: {
      token: data.token,
      userId: data.userId,
      expiresAt: data.expiresAt
    }
  })
}

async function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  })
}

async function deleteRefreshToken(token) {
  return prisma.refreshToken.deleteMany({
    where: { token }
  })
}
module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken
}
