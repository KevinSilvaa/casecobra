'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

enum FILTER_STATUS {
  all = 'all',
  awaiting_shipment = 'awaiting_shipment',
  fulfilled = 'fulfilled',
  shipped = 'shipped',
}

const LABEL_MAP: Record<FILTER_STATUS, string> = {
  [FILTER_STATUS.all]: 'All',
  [FILTER_STATUS.awaiting_shipment]: 'Awaiting shipment',
  [FILTER_STATUS.fulfilled]: 'Fulfilled',
  [FILTER_STATUS.shipped]: 'Shipped',
}

const orderFiltersSchema = z.object({
  orderId: z.string().optional(),
  customer: z.string().optional(),
  status: z.nativeEnum(FILTER_STATUS).optional(),
})

type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export function OrderTableFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get('orderId') ?? undefined
  const customer = searchParams.get('customer') ?? undefined
  const status =
    (searchParams.get('status') as FILTER_STATUS) ?? FILTER_STATUS.all

  const { register, handleSubmit, control, reset } =
    useForm<OrderFiltersSchema>({
      resolver: zodResolver(orderFiltersSchema),
      defaultValues: {
        orderId: orderId ?? '',
        customer: customer ?? '',
        status,
      },
    })

  const params = new URLSearchParams(searchParams.toString())

  function handleFilter({ customer, orderId, status }: OrderFiltersSchema) {
    if (orderId) {
      params.set('orderId', orderId)
    } else {
      params.delete('orderId')
    }

    if (customer) {
      params.set('customer', customer)
    } else {
      params.delete('customer')
    }

    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  function handleClearFilters() {
    params.delete('orderId')
    params.delete('customerName')
    params.delete('status')
    params.set('page', '1')

    reset({
      orderId: '',
      customer: '',
      status: FILTER_STATUS.all,
    })

    router.push(`?${params.toString()}`)
  }

  console.log(Object.keys(FILTER_STATUS))

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="min-w-screen flex items-center gap-2">
        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
          <span className="text-sm font-semibold">Filters:</span>

          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Input
              placeholder="Order ID"
              className="h-9 w-auto"
              {...register('orderId')}
            />

            <Input
              placeholder="Customer"
              className="h-9 w-full lg:w-44 xl:w-[320px]"
              {...register('customer')}
            />

            <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => {
                return (
                  <Select
                    defaultValue={FILTER_STATUS.all}
                    name={name}
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                  >
                    <SelectTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-between md:min-w-52"
                      >
                        <p>{LABEL_MAP[value!]}</p>
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </SelectTrigger>

                    <SelectContent className="min-w-screen">
                      {Object.keys(FILTER_STATUS).map((key) => {
                        const status = key as FILTER_STATUS

                        return (
                          <SelectItem
                            key={status}
                            value={status}
                            className={cn('group transition-all', {
                              'bg-zinc-100': value === status,
                            })}
                          >
                            <div className="flex w-full cursor-default items-center gap-1 p-2.5 text-sm">
                              <Check
                                className={cn(
                                  'mr-2 size-4 text-primary opacity-0',
                                  {
                                    'opacity-100': value === status,
                                  },
                                )}
                              />
                              {LABEL_MAP[status]}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <Button variant="outline" type="submit" className="md:w-1/2">
          <Search className="mr-2 size-4" />
          Filter results
        </Button>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          type="button"
          className="md:w-1/2"
        >
          <X className="mr-2 size-4" />
          Remove filters
        </Button>
      </div>
    </form>
  )
}

OrderTableFilters.Skeleton = function OrderTableFiltersSkeleton() {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-screen flex items-center gap-2">
        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center">
          <Skeleton className="h-5 w-[51px]" />

          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Skeleton className="h-9 w-auto md:min-w-[203px]" />

            <Skeleton className="h-9 w-full md:min-w-[176px] lg:w-44 xl:min-w-[203px]" />

            <Skeleton className="h-9 w-full md:min-w-52 xl:min-w-[325px]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <Button disabled variant="outline" type="submit" className="md:w-1/2">
          <Search className="mr-2 size-4" />
          Filter results
        </Button>
        <Button disabled variant="outline" type="button" className="md:w-1/2">
          <X className="mr-2 size-4" />
          Remove filters
        </Button>
      </div>
    </div>
  )
}
