import * as z from 'zod'

const metadataItemSchema = z.object({
  SERCODIGO: z.string(),
  SERNOME: z.string(),
  SERCOMENTARIO: z.string().nullable().optional(),
  SERATUALIZACAO: z.string().nullable().optional(),
  BASNOME: z.string().nullable().optional(),
  FNTSIGLA: z.string().nullable().optional(),
  FNTNOME: z.string().nullable().optional(),
  FNTURL: z.string().nullable().optional(),
  PERNOME: z.string().nullable().optional(),
  UNINOME: z.string().nullable().optional(),
  MULNOME: z.string().nullable().optional(),
  SERSTATUS: z.string().nullable().optional(),
  TEMCODIGO: z.number().nullable().optional(),
  PAICODIGO: z.string().nullable().optional(),
  SERNUMERICA: z.boolean().nullable().optional(),
})

export type MetadataItem = z.infer<typeof metadataItemSchema>

const dataSchema = z.object({
  value: z.array(metadataItemSchema),
})

export async function getAllMetadata(options?: {
  signal?: AbortSignal
}): Promise<MetadataItem[]> {
  const url = `${import.meta.env.VITE_API_URL}/Metadados`
  const response = await fetch(url, { signal: options?.signal })
  if (!response.ok) {
    throw new Error('Failed to fetch metadata')
  }

  const json = await response.json()
  const result = dataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected metadata format: ${result.error}`)
  }

  return result.data.value
}
