import * as z from 'zod'

const dataSchema = z.object({
  value: z.array(
    z.object({
      SERCODIGO: z.string().optional(),
      VALDATA: z.string(),
      VALVALOR: z.number().nullable(),
      NIVNOME: z.string().nullable().optional(),
      TERCODIGO: z.string().nullable().optional(),
    }),
  ),
})

export type RawSeriesValue = z.infer<typeof dataSchema>['value'][number]

const compiledDataSchema = z.compile(dataSchema)

export async function getSeriesValues(
  code: string,
  { signal }: { signal: AbortSignal },
): Promise<RawSeriesValue[]> {
  const url = `${import.meta.env.VITE_API_URL}/Metadados('${code}')/Valores`
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Failed to fetch series values')
  }

  const json = await response.json()
  const result = compiledDataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected data format: ${result.error}`)
  }

  return result.data.value
}
