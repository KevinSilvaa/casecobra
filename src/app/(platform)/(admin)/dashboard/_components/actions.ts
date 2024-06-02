'use server'

import { ORDER_STATUS } from '@prisma/client'

import { ORDERS_PER_PAGE } from '@/constants/orders'
import { prisma } from '@/lib/prisma'

import { OrdersProps } from './orders'

export async function getOrders({
  pageIndex = 0,
  orderId,
  customer,
  status,
}: OrdersProps) {
  const page = pageIndex + 1

  const orders = await prisma.order.findMany({
    where: {
      id: orderId,
      status: status === 'all' ? undefined : (status as ORDER_STATUS),
      OR: [
        { shippingAddress: { name: { contains: customer } } },
        { billingAddress: { name: { contains: customer } } },
        { user: { email: { contains: customer } } },
      ],
    },
    include: {
      billingAddress: true,
      shippingAddress: true,
      configuration: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * ORDERS_PER_PAGE,
    take: page * ORDERS_PER_PAGE,
  })

  const ordersCount = await prisma.order.count({
    where: {
      id: orderId,
      status: status === 'all' ? undefined : (status as ORDER_STATUS),
      OR: [
        { shippingAddress: { name: { contains: customer } } },
        { billingAddress: { name: { contains: customer } } },
        { user: { email: { contains: customer } } },
      ],
    },
  })

  if (!orders) {
    return {
      orders: [],
      ordersCount: 0,
    }
  }

  return {
    orders,
    ordersCount,
  }
}

type ChangeOrderStatusProps = {
  orderId: string
  newStatus: ORDER_STATUS
}

export async function changeOrderStatus({
  orderId,
  newStatus,
}: ChangeOrderStatusProps) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: newStatus,
    },
  })

  return {
    status: updatedOrder.status,
  }
}
