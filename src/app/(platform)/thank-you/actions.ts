'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import { prisma } from '@/lib/prisma'

type GetPaymentStatusProps = {
  orderId: string
}

export async function getPaymentStatus({ orderId }: GetPaymentStatusProps) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('You need to be logged in to view this page.')
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  })

  if (!order) {
    throw new Error('This order does not exist.')
  }

  if (order.isPaid) {
    return order
  }

  return false
}
