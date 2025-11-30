import * as z from 'zod'

const dataSchema = z.object({
  value: z.array(
    z.object({
      SERCODIGO: z.string(),
      SERNOME: z.string(),
      SERNUMERICA: z.boolean(),
    }),
  ),
})

type SearchItem = {
  code: string
  name: string
}

export async function search(
  name: string,
  { signal }: { signal: AbortSignal },
): Promise<SearchItem[]> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/Metadados`)
  url.searchParams.set('$select', 'SERCODIGO,SERNOME,SERNUMERICA')

  const filters = []
  filters.push(`SERNUMERICA eq true`)
  if (name) {
    const words = name.split(/\s+/)
    for (const word of words) {
      filters.push(`contains(SERNOME,'${word}')`)
    }
  }
  url.searchParams.set('$filter', filters.join(' and '))

  url.searchParams.set('$top', '10')

  const response = await fetch(url, {
    signal,
  })
  if (!response.ok) {
    throw new Error(`Failed to search for '${name}'`)
  }

  const rawData = await response.json()
  const result = dataSchema.safeParse(rawData)
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
