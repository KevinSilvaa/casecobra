'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ORDERS_PER_PAGE } from '@/constants/orders'
import { formatPrice } from '@/utils/format-price'

import { getOrders } from './actions'
import { OrderTableFilters } from './order-table-filters'
import { Pagination } from './pagination'
import { StatusDropdown } from './status-dropdown'

export type OrdersProps = {
  pageIndex: number
  orderId?: string | undefined
  customer?: string | undefined
  status?: string | undefined
}

export function Orders() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('orderId') ?? undefined
  const customer = searchParams.get('customer') ?? undefined
  const status = searchParams.get('status') ?? 'all'

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', pageIndex, orderId, customer, status],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId,
        customer,
        status,
      }),
  })

  function handlePaginate(pageIndex: number) {
    const params = new URLSearchParams(searchParams.toString())

    params.set('page', (pageIndex + 1).toString())

    router.push(`?${params.toString()}`)
  }

  return isOrdersLoading ? (
    <Orders.Skeleton />
  ) : (
    <div className="flex h-full flex-col gap-4 px-4 pb-4 sm:pb-0">
      <OrderTableFilters />

      <div className="flex h-full flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">
                Purchase date
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">
                    {order.shippingAddress?.name}
                  </div>

                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.user.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <StatusDropdown
                    orderId={order.id}
                    orderStatus={order.status}
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {order.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(order.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data?.orders && (
          <Pagination
            pageIndex={pageIndex}
            totalCount={data.ordersCount}
            perPage={ORDERS_PER_PAGE}
            onPageChange={handlePaginate}
          />
        )}
      </div>
    </div>
  )
}

Orders.Skeleton = function OrdersSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 px-4 pb-4 sm:pb-0">
      <OrderTableFilters.Skeleton />

      <div className="flex h-full flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">
                Purchase date
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex h-14 flex-col gap-y-1">
                  <div>
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="hidden md:inline">
                    <Skeleton className="h-4 w-[171px]" />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-9 w-52" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto mr-0 h-5 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination.Skeleton />
      </div>
    </div>
  )
}
