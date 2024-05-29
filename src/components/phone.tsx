import Image from 'next/image'
import { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type PhoneProps = HTMLAttributes<HTMLDivElement> & {
  imgSrc: string
  dark?: boolean
}

export function Phone({
  imgSrc,
  dark = false,
  className,
  ...props
}: PhoneProps) {
  return (
    <div
      className={cn(
        'pointer-events-none relative z-50 overflow-hidden',
        className,
      )}
      {...props}
    >
      <Image
        src={
          dark
            ? '/phone-template-dark-edges.png'
            : '/phone-template-white-edges.png'
        }
        alt="Phone image"
        width={256}
        height={523}
        className="pointer-events-none z-50 min-h-full min-w-full select-none"
      />

      <div className="absolute inset-0 -z-10">
        <Image
          src={imgSrc}
          alt="Overlaying phone image"
          width={256}
          height={523}
          className="min-h-full min-w-full object-cover"
        />
      </div>
    </div>
  )
}
