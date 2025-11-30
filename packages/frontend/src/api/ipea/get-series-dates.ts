import * as z from 'zod'
import { compareAsc } from 'date-fns'

const dataSchema = z.object({
  value: z.array(
    z.object({
      ANO: z.number(),
      MES: z.number(),
      DIA: z.number(),
    }),
  ),
})

export async function getSeriesDates(
  code: string,
  { signal }: { signal: AbortSignal },
): Promise<Date[]> {
  const url = new URL(
    `${import.meta.env.VITE_API_URL}/Metadados('${code}')/Valores`,
  )

  url.searchParams.set('$apply', 'groupby((ANO,MES,DIA))')

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Failed to fetch series dates')
  }

  const json = await response.json()
  const result = dataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected data format: ${result.error}`)
  }

  return result.data.value
    .map((item) => new Date(item.ANO, item.MES - 1, item.DIA))
    .sort(compareAsc)
}
