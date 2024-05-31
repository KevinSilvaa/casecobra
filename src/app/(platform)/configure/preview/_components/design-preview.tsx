'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Configuration } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { toast } from 'sonner'

import { Phone } from '@/components/phone'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format-price'
import { COLORS, MODELS } from '@/validators/option-validator'

import { createCheckoutSession } from '../actions'
import { LoginModal } from './login-modal'

type DesignPreviewProps = {
  configuration: Configuration
}

export function DesignPreview({ configuration }: DesignPreviewProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
  }, [])

  const router = useRouter()

  const { user } = useKindeBrowserClient()

  const { color, model, material, finish } = configuration

  const tw = COLORS.find((supportedColor) => supportedColor.value === color)?.tw
  const modelLabel = MODELS.options.find(
    (supportedModel) => supportedModel.value === model,
  )?.label

  const totalPriceInCents =
    BASE_PRICE +
    PRODUCT_PRICES.material?.[material!] +
    PRODUCT_PRICES.finish?.[finish!]

  const { mutate: createCheckoutSessionFn } = useMutation({
    mutationKey: ['get-checkout-session'],
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      if (data.url) {
        router.push(data.url)
      }

      throw new Error('Unable to retrieve payment URL.')
    },
    onError: () => {
      toast.error('Something went wrong', {
        description: 'There was an error on our end. Please try again.',
      })
    },
  })

  async function handleCheckout() {
    if (user) {
      createCheckoutSessionFn({ configId: configuration.id })
    }

    localStorage.setItem('configurationId', configuration.id)
    setIsLoginModalOpen(true)
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden"
      >
        <Confetti
          active={showConfetti}
          config={{
            elementCount: 200,
            spread: 90,
          }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            imgSrc={configuration.croppedImageUrl!}
            className={cn(`bg-${tw}`)}
          />
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>

          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="size-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="text-base sm:col-span-12 md:col-span-9">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>

              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-zinc-950">Materials</p>

              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="mt-2 flex items-center justify-between py-1">
                  <p className="text-gray-600">Base price</p>

                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>

                {material === 'polycarbonate' && (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Soft Polycarbonate material</p>

                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                )}

                {finish === 'textured' && (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Textured finish</p>

                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                )}

                <Separator className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>

                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPriceInCents / 100)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button onClick={handleCheckout} className="px-4 sm:px-6 lg:px-8">
                Checkout
                <ArrowRight className="ml-1.5 inline size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
