import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const body = await req.text()

    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { message: 'Invalid signature.' },
        { status: 400 },
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) {
        throw new Error('Missing user email.')
      }

      const session = event.data.object

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      }

      if (!userId || !orderId) {
        throw new Error('Invalid request metadata.')
      }

      const billingAddress = session.customer_details!.address
      const shippingAddress = session.shipping_details!.address

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          billingAddress: {
            create: {
              name: session.customer_details?.name as string,
              city: billingAddress?.city as string,
              country: billingAddress?.country as string,
              postalCode: billingAddress?.postal_code as string,
              street: billingAddress?.line1 as string,
              state: billingAddress?.state as string,
            },
          },
          shippingAddress: {
            create: {
              name: session.customer_details?.name as string,
              city: shippingAddress?.city as string,
              country: shippingAddress?.country as string,
              postalCode: shippingAddress?.postal_code as string,
              street: shippingAddress?.line1 as string,
              state: shippingAddress?.state as string,
            },
          },
        },
      })
    }

    return NextResponse.json({ result: event, ok: true }, { status: 200 })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'Something went wrong', ok: false },
      { status: 500 },
    )
  }
}
