'use client'

import {
  Description as RadioGroupDescription,
  Label as RadioGroupLabel,
  Radio,
  RadioGroup,
} from '@headlessui/react'
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Rnd } from 'react-rnd'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { BASE_PRICE } from '@/config/products'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format-price'
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from '@/validators/option-validator'

import { HandleComponent } from './handle-component'

type DesignConfiguratorProps = {
  configId: string
  imageUrl: string
  imageDimensions: {
    width: number
    height: number
  }
}

export function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number]
    model: (typeof MODELS.options)[number]
    material: (typeof MATERIALS.options)[number]
    finish: (typeof FINISHES.options)[number]
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  })

  return (
    <div className="relative my-20 grid grid-cols-3 pb-20">
      <div className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
          <AspectRatio
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <Image
              src="/phone-template.png"
              alt="Phone image"
              fill
              sizes="100%"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>

          <div className="absolute inset-0 bottom-px left-[3px] right-[3px] top-px z-40 rounded-[32px] shadow-configurator" />

          <div
            className={cn(
              'absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]',
              `bg-${options.color.tw}`,
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            width: imageDimensions.width / 4,
            height: imageDimensions.height / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          className="x-20 absolute border-[3px] border-primary"
        >
          <div className="relative size-full">
            <Image
              src={imageUrl}
              alt="Your image"
              fill
              sizes="100%"
              priority
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      <div className="flex h-[37.5rem] flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Customize your case
            </h2>

            <Separator className="my-6 h-px w-full bg-zinc-200" />

            <div className="relative mt-4 flex h-full flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(value) =>
                    setOptions((prev) => ({ ...prev, color: value }))
                  }
                >
                  <Label>Color: {options.color.label}</Label>

                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ checked }) =>
                          cn(
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0',
                            {
                              [`border-${color.tw}`]: checked,
                            },
                          )
                        }
                      >
                        <span
                          className={cn(
                            'size-8 rounded-full border border-black border-opacity-10',
                            `bg-${color.tw}`,
                          )}
                        ></span>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative flex w-full flex-col gap-3">
                  <Label>Model</Label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        role="combobox"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          onClick={() =>
                            setOptions((prev) => ({ ...prev, model }))
                          }
                          className={cn(
                            'flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100',
                            {
                              'bg-zinc-100':
                                model.label === options.model.label,
                            },
                          )}
                        >
                          <Check
                            className={cn('mr-2 size-4 opacity-0', {
                              'opacity-100':
                                model.label === options.model.label,
                            })}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(value) =>
                        setOptions((prev) => ({ ...prev, [name]: value }))
                      }
                    >
                      <Label className="capitalize">{name}</Label>

                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked }) =>
                              cn(
                                'relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between',
                                {
                                  'border-primary': checked,
                                },
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroupLabel
                                  as="span"
                                  className="font-medium text-gray-900"
                                >
                                  {option.label}
                                </RadioGroupLabel>

                                {option.description && (
                                  <RadioGroupDescription
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </RadioGroupDescription>
                                )}
                              </span>
                            </span>

                            <RadioGroupDescription
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price / 100)}
                              </span>
                            </RadioGroupDescription>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  ),
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="h-16 w-full bg-white px-8">
          <div className="h-px w-full bg-zinc-200" />

          <div className="flex size-full items-center justify-end">
            <div className="flex w-full items-center gap-6">
              <p className="whitespace-nowrap font-medium">
                {formatPrice(
                  (BASE_PRICE + options.material.price + options.finish.price) /
                    100,
                )}
              </p>

              <Button size="sm" className="w-full">
                Continue
                <ArrowRight className="ml-1.5 inline size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
