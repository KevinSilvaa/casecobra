import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'

import { DesignConfigurator } from './_components/design-configurator'

type DesignPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function DesignPage({ searchParams }: DesignPageProps) {
  const imageId = searchParams.id

  if (!imageId || typeof imageId !== 'string') {
    return notFound()
  }

  const configuration = await prisma.configuration.findUnique({
    where: {
      id: imageId,
    },
  })

  if (!configuration) {
    return notFound()
  }

  const { imageUrl, width, height } = configuration

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageUrl={imageUrl}
      imageDimensions={{ width, height }}
    />
  )
}
