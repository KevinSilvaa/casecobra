import sharp from 'sharp'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .input(
      z.object({
        configId: z.string().optional(),
      }),
    )
    .middleware(async ({ input }) => {
      return {
        input,
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input

      const imageResponse = await fetch(file.url)
      const buffer = await imageResponse.arrayBuffer()

      const imageMetadata = await sharp(buffer).metadata()

      const { width, height } = imageMetadata

      if (!configId) {
        const configuration = await prisma.configuration.create({
          data: {
            imageUrl: file.url,
            width: width || 500,
            height: height || 500,
          },
        })

        return {
          configId: configuration.id,
        }
      }

      const updatedConfiguration = await prisma.configuration.update({
        where: {
          id: configId,
        },
        data: {
          croppedImageUrl: file.url,
        },
      })

      return {
        configId: updatedConfiguration.id,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
