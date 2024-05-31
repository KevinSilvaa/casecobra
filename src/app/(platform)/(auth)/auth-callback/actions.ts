'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import { prisma } from '@/lib/prisma'

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('Invalid user data')
  }

  const existingUser = await prisma.user.findFirst({
    where: { id: user.id },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    })
  }

  return { success: true }
}
