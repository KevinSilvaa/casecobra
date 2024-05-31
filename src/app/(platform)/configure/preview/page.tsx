import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'

import { DesignPreview } from './_components/design-preview'

type PreviewPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const configId = searchParams.id

  if (!configId || typeof configId !== 'string') {
    return notFound()
  }

  const configuration = await prisma.configuration.findUnique({
    where: {
      id: configId,
    },
  })

  if (!configuration) {
    return notFound()
  }

  return <DesignPreview configuration={configuration} />
}
