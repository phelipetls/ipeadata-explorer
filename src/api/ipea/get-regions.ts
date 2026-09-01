import * as z from 'zod'

const compiledTerritorySchema = z.compile(
  z.object({
    value: z.array(
      z.object({
        NIVNOME: z.string(),
        TERCODIGO: z.string(),
        TERNOME: z.string().nullable(),
      }),
    ),
  }),
)

type RegionsMap = Record<string, string>

export async function getRegions(options?: {
  signal?: AbortSignal
}): Promise<RegionsMap> {
  const url = `${import.meta.env.VITE_API_URL}/Territorios`
  const response = await fetch(url, { signal: options?.signal })
  if (!response.ok) {
    throw new Error('Failed to fetch regions')
  }

  const json = await response.json()
  const result = compiledTerritorySchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected regions format: ${result.error}`)
  }

  const regions: RegionsMap = {}
  for (const item of result.data.value) {
    if (item.TERNOME) {
      regions[item.TERCODIGO] = item.TERNOME
    }
  }

  return regions
}
