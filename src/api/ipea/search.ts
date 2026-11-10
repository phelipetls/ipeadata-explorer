import * as z from 'zod'

const seriesSchema = z.object({
  SERCODIGO: z.string(),
  SERNOME: z.string(),
  SERNUMERICA: z.boolean().nullable().optional(),
})

const compiledDataSchema = z.compile(
  z.object({
    value: z.array(seriesSchema),
  }),
)

type SearchItem = {
  code: string
  name: string
}

export async function search(
  name: string,
  { signal }: { signal: AbortSignal },
): Promise<SearchItem[]> {
  const filters = []
  filters.push(`SERNUMERICA eq true`)
  if (name) {
    const words = name.split(/\s+/)
    for (const word of words) {
      filters.push(`indexof(SERNOME,'${word.replace(/'/g, "''")}') ge 0`)
    }
  }

  const params = new URLSearchParams()
  params.set('$filter', filters.join(' and '))
  params.set('$top', '10')

  const url = `${import.meta.env.VITE_API_URL}/Metadados?${params}`

  const response = await fetch(url, {
    signal,
  })
  if (!response.ok) {
    throw new Error(`Failed to search for '${name}'`)
  }

  const rawData = await response.json()
  const result = compiledDataSchema.safeParse(rawData)
  if (!result.success) {
    throw new Error(`Unexpected data format`)
  }

  return result.data.value.map((item) => {
    return {
      name: item.SERNOME,
      code: item.SERCODIGO,
    }
  })
}
