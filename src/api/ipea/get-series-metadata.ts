import * as z from 'zod'

const dataSchema = z.object({
  value: z.array(
    z.object({
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
    }),
  ),
})

export type RawSeriesMetadata = z.infer<typeof dataSchema>['value'][number]

const compiledDataSchema = z.compile(dataSchema)

export async function getSeriesMetadata(
  code: string,
  { signal }: { signal: AbortSignal },
): Promise<RawSeriesMetadata> {
  const url = `${import.meta.env.VITE_API_URL}/Metadados('${code}')`
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Failed to fetch series metadata')
  }

  const json = await response.json()
  const result = compiledDataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected data format: ${result.error}`)
  }

  const value = result.data.value[0]
  if (!value) {
    throw new Error(`Unexpectedly missing metadata for series ${code}`)
  }

  return value
}
