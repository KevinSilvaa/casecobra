'use client'

import { CASE_COLOR } from '@prisma/client'
import Image from 'next/image'
import { ElementRef, useEffect, useRef, useState } from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/utils/cn'

type PhonePreviewProps = {
  croppedImageUrl: string
  color: CASE_COLOR
}

export function PhonePreview({ croppedImageUrl, color }: PhonePreviewProps) {
  const [renderedDimensions, setRenderedDimensions] = useState({
    width: 0,
    height: 0,
  })

  const ref = useRef<ElementRef<'div'>>(null)

  function handleResize() {
    if (!ref.current) {
      return
    }

    const { width, height } = ref.current.getBoundingClientRect()

    setRenderedDimensions({
      width,
      height,
    })
  }

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  let caseBackgroundColor = 'bg-zinc-950'

  if (color === 'blue') {
    caseBackgroundColor = 'bg-blue-950'
  }

  if (color === 'rose') {
    caseBackgroundColor = 'bg-rose-950'
  }

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
      <div
        style={{
          left:
            renderedDimensions.width / 2 -
            renderedDimensions.width / (1216 / 121),
          top: renderedDimensions.height / 6.2,
        }}
        className="absolute z-20 scale-[1.0352]"
      >
        <Image
          src={croppedImageUrl}
          alt="Custom case image"
          width={renderedDimensions.width / (3000 / 637)}
          height={1831}
          className={cn(
            'phone-skew relative z-20 rounded-b-[10px] rounded-t-[15px] md:rounded-b-[20px] md:rounded-t-[30px]',
            caseBackgroundColor,
          )}
        />
      </div>

      <div className="relative z-40 size-full">
        <Image
          src="/clearphone.png"
          alt="Custom case background"
          width={3000}
          height={2001}
          className="pointer-events-none size-full rounded-md antialiased"
        />
      </div>
    </AspectRatio>
  )
}
