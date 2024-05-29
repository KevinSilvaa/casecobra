'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { cn } from '@/utils/cn'

const STEPS = [
  {
    name: 'Step 1: Add image',
    description: 'Choose an image for your case',
    url: '/upload',
  },
  {
    name: 'Step 2: Customize design',
    description: 'Make the case yours',
    url: '/design',
  },
  {
    name: 'Step 3: Summary',
    description: 'Review your final design',
    url: '/preview',
  },
]

export function Steps() {
  const pathname = usePathname()

  return (
    <ol className="rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:bg-gray-200">
      {STEPS.map((step, i) => {
        const isCurrent = pathname.endsWith(step.url)
        const isCompleted = STEPS.slice(i + 1).some((step) =>
          pathname.endsWith(step.url),
        )

        const imgPath = `/snake-${i + 1}.png`

        return (
          <li key={step.name} className="relative overflow-hidden lg:flex-1">
            <div>
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full',
                  {
                    'bg-primary': isCompleted,
                    'bg-zinc-700': isCurrent,
                  },
                )}
              />

              <span
                className={cn(
                  'flex items-center px-6 py-4 text-sm font-medium',
                  {
                    'lg>pl-9': i !== 0,
                  },
                )}
              >
                <span className="flex-shrink-0">
                  <Image
                    src={imgPath}
                    alt={`Step ${i + 1} image`}
                    width={80}
                    height={80}
                    priority
                    className={cn(
                      'flex size-20 items-center justify-center object-contain',
                      {
                        'border-none': isCompleted,
                        'border-zinc-700': isCurrent,
                      },
                    )}
                  />
                </span>

                <span className="ml-4 mt-0.5 flex h-full min-w-0 flex-col justify-center">
                  <span
                    className={cn('text-sm font-semibold text-zinc-700', {
                      'text-primary': isCompleted,
                      'text-zinc-700': isCurrent,
                    })}
                  >
                    {step.name}
                  </span>

                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </span>

              {i !== 0 && (
                <div className="absolute inset-0 hidden w-3 lg:block">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.5 0V31L10.5 41L0.5 51V82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
