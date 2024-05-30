'use server'

import {
  CASE_COLOR,
  CASE_FINISH,
  CASE_MATERIAL,
  PHONE_MODEL,
} from '@prisma/client'

import { prisma } from '@/lib/prisma'

export type SaveConfigProps = {
  color: CASE_COLOR
  model: PHONE_MODEL
  material: CASE_MATERIAL
  finish: CASE_FINISH
  configId: string
}

export async function saveConfig({
  color,
  model,
  material,
  finish,
  configId,
}: SaveConfigProps) {
  await prisma.configuration.update({
    where: {
      id: configId,
    },
    data: {
      color,
      model,
      material,
      finish,
    },
  })
}
