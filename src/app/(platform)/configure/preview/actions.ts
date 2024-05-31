'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Order } from '@prisma/client'

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

type CreateCheckoutSessionProps = {
  configId: string
}

export async function createCheckoutSession({
  configId,
}: CreateCheckoutSessionProps) {
  const configuration = await prisma.configuration.findUnique({
    where: {
      id: configId,
    },
  })

  if (!configuration) {
    throw new Error('Configuration not found.')
  }

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error('You need to be logged in.')
  }

  const { material, finish } = configuration

  const totalPriceInCents =
    BASE_PRICE +
    PRODUCT_PRICES.material?.[material!] +
    PRODUCT_PRICES.finish?.[finish!]

  let order: Order | undefined

  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configId,
    },
  })

  if (existingOrder) {
    order = existingOrder
  } else {
    order = await prisma.order.create({
      data: {
        amount: totalPriceInCents / 100,
        userId: user.id,
        configurationId: configId,
      },
    })
  }

  const product = await stripe.products.create({
    name: 'Custom Iphone Case',
    images: [configuration.imageUrl],
    default_price_data: {
      currency: 'USD',
      unit_amount: totalPriceInCents,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'DE'],
    },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [
      {
        price: product.default_price as string,
        quantity: 1,
      },
    ],
  })

  return {
    url: stripeSession.url,
  }
}
