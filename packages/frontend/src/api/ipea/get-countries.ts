import * as z from 'zod'

const dataSchema = z.object({
  value: z.array(
    z.object({
      PAICODIGO: z.string(),
      PAINOME: z.string(),
    }),
  ),
})

export async function getCountries({
  signal,
}: {
  signal: AbortSignal
}): Promise<Record<string, string>> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/Paises`)

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  const json = await response.json()
  const result = dataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected data format: ${result.error}`)
  }

  return Object.fromEntries(
    result.data.value.map((item) => {
      return [item.PAICODIGO, item.PAINOME]
    }),
  )
}
