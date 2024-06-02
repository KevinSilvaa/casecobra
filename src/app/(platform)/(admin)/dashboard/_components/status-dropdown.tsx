'use client'

import {
  BillingAddress,
  Configuration,
  Order,
  ORDER_STATUS,
  ShippingAddress,
  User,
} from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/cn'

import { changeOrderStatus } from './actions'

const LABEL_MAP: Record<keyof typeof ORDER_STATUS, string> = {
  awaiting_shipment: 'Awaiting shipment',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
}

type StatusDropdownProps = {
  orderId: string
  orderStatus: ORDER_STATUS
}

type OrderWithAllRelations = Order & {
  billingAddress: BillingAddress
  shippingAddress: ShippingAddress
  configuration: Configuration
  user: User
}

export function StatusDropdown({ orderId, orderStatus }: StatusDropdownProps) {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { mutate: changeOrderStatusFn } = useMutation({
    mutationKey: ['change-order-status'],
    mutationFn: changeOrderStatus,
    onSuccess: (data) => {
      const { status } = data

      queryClient.setQueriesData<OrderWithAllRelations[]>(
        { queryKey: ['orders', pageIndex] },
        (oldData) => {
          if (!oldData) {
            return oldData
          }

          return oldData.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          )
        },
      )
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-52 items-center justify-between"
        >
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.keys(ORDER_STATUS).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() =>
              changeOrderStatusFn({
                orderId,
                newStatus: status as ORDER_STATUS,
              })
            }
            className={cn(
              'flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100',
              {
                'bg-zinc-100': orderStatus === status,
              },
            )}
          >
            <Check
              className={cn('mr-2 size-4 text-primary opacity-0', {
                'opacity-100': orderStatus === status,
              })}
            />
            {LABEL_MAP[status as ORDER_STATUS]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
