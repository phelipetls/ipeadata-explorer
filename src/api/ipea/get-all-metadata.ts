import * as z from 'zod'

const seriesMetadataSchema = z.object({
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

export type SeriesMetadata = z.infer<typeof seriesMetadataSchema>

const compiledDataSchema = z.compile(
  z.object({
    value: z.array(seriesMetadataSchema),
  }),
)

export async function getAllSeriesMetadata(options?: {
  signal?: AbortSignal
}): Promise<SeriesMetadata[]> {
  const url = `${import.meta.env.VITE_API_URL}/Metadados`
  const response = await fetch(url, { signal: options?.signal })
  if (!response.ok) {
    throw new Error('Failed to fetch metadata')
  }

  const json = await response.json()
  const result = compiledDataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected metadata format: ${result.error}`)
  }

  return result.data.value
}
