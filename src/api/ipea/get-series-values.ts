import * as z from 'zod'
import { format } from 'date-fns'
import type { RegionalLevel } from '../../types'

const dataSchema = z.object({
  value: z.array(
    z.object({
      VALVALOR: z.number().nullable(),
      ANO: z.number(),
      MES: z.number(),
      DIA: z.number(),
      TERNOME: z.string().nullish(),
      TERCODIGO: z.string().nullish(),
    }),
  ),
})

const formatStartDate = (date: Date): string =>
  format(date, "yyyy-MM-dd'T00:00:00Z'")

const formatEndDate = (date: Date): string =>
  format(date, "yyyy-MM-dd'T00:00:00-03:00'")

const mapToIpeaRegionalLevel: Record<RegionalLevel, string> = {
  brazil: 'Brasil',
  regions: 'Regiões',
  states: 'Estados',
  municipalities: 'Municípios',
}

type Options = {
  signal: AbortSignal
  regionalLevel?: RegionalLevel
  regions?: string[]
  startDate?: Date
  endDate?: Date
}

type Value = {
  date: Date
  value: number | null
  region?: {
    name: string
    code: number
  }
}

export async function getSeriesValues(
  code: string,
  { signal, startDate, endDate, regions = [], regionalLevel }: Options,
): Promise<Value[]> {
  const url = new URL(
    `https://ipeadata.gov.br/api/v1/Metadados('${code}')/Valores`,
  )

  url.searchParams.set('$select', 'VALVALOR,ANO,MES,DIA,TERNOME,TERCODIGO')

  const filterParts: string[] = []
  if (regionalLevel) {
    filterParts.push(`NIVNOME eq '${mapToIpeaRegionalLevel[regionalLevel]}'`)
  }

  if (regions.length > 0) {
    const regionFilters = regions.map((region) => `TERNOME eq '${region}'`)
    filterParts.push(`(${regionFilters.join(' or ')})`)
  }

  if (startDate || endDate) {
    if (startDate) filterParts.push(`VALDATA ge ${formatStartDate(startDate)}`)
    if (endDate) filterParts.push(`VALDATA le ${formatEndDate(endDate)}`)
  }

  if (filterParts.length > 0) {
    url.searchParams.set('$filter', filterParts.join(' and '))
  }

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Failed to fetch series')
  }

  const json = await response.json()
  const result = dataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected data format: ${result.error}`)
  }

  return result.data.value.map((item) => {
    const value: Value = {
      date: new Date(item.ANO, item.MES - 1, item.DIA),
      value: item.VALVALOR,
    }

    if (item.TERNOME && item.TERCODIGO) {
      value.region = { name: item.TERNOME, code: Number(item.TERCODIGO) }
    }

    return value
  })
}
