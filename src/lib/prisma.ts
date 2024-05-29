import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prismaInstance: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prismaInstance = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }

  prismaInstance = global.cachedPrisma
}

export const prisma = prismaInstance
