import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/utils/format-price'

import { Orders } from './_components/orders'

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound()
  }

  const lastWeekAmountSum = await prisma.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 daus
      },
    },
    _sum: {
      amount: true,
    },
  })

  const lastMonthAmountSum = await prisma.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 daus
      },
    },
    _sum: {
      amount: true,
    },
  })

  const WEEKLY_GOAL = 500
  const MONTHLY_GOAL = 2500

  return (
    <div className="flex w-full bg-muted/40">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-1 flex-col pt-4 sm:gap-4 sm:py-4 lg:min-h-[calc(100vh-138px)]">
        <div className="flex h-full flex-col gap-16">
          <div className="grid gap-4 px-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>

                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekAmountSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>

              <CardFooter>
                <Progress
                  value={
                    ((lastWeekAmountSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL
                  }
                />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Month</CardDescription>

                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthAmountSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>

              <CardFooter>
                <Progress
                  value={
                    ((lastMonthAmountSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL
                  }
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className="px-4 text-4xl font-bold tracking-tight">
            Incoming orders
          </h1>

          <Orders />
        </div>
      </div>
    </div>
  )
}
