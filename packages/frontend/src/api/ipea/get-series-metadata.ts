import * as z from 'zod'
import type {
  SeriesDatabase,
  SeriesPeriodicity,
  RegionalLevel,
} from '../../types'
import { parse } from 'date-fns'
import { getSeriesDates } from './get-series-dates'
import { getCountries } from './get-countries'

const dataSchema = z.object({
  value: z.array(
    z.object({
      SERNOME: z.string(),
      SERCOMENTARIO: z.string(),
      SERSTATUS: z.string().nullable(),
      UNINOME: z.string(),
      PERNOME: z.string(),
      FNTSIGLA: z.string().nullable(),
      FNTNOME: z.string().nullable(),
      FNTURL: z.string(),
      TEMNOME: z.string(),
      SERMINDATA: z.string(),
      SERMAXDATA: z.string(),
      SERATUALIZACAO: z.string(),
      PAICODIGO: z.string().nullable(),
      BASNOME: z.string(),
      SERDECIMAIS: z.number(),
      SERTEMBR: z.number().nullable(),
      SERTEMEST: z.number().nullable(),
      SERTEMMUN: z.number().nullable(),
      SERTEMMET: z.number().nullable(),
    }),
  ),
})

const periodicityMap: Record<string, SeriesPeriodicity> = {
  Diária: 'daily',
  Mensal: 'monthly',
  Trimestral: 'quarterly',
  Anual: 'yearly',
  Quadrienal: 'quadrennial',
  Decenal: 'decennial',
}

function mapPeriodicity(pernome: string): SeriesPeriodicity {
  return periodicityMap[pernome] || 'yearly'
}

const databaseMap: Record<string, SeriesDatabase> = {
  Macroeconômico: 'macroeconomic',
  Regional: 'regional',
  Social: 'social',
}

function mapDatabase(pernome: string): SeriesDatabase {
  return databaseMap[pernome] || 'macroeconomic'
}

export async function getSeriesMetadata(
  code: string,
  { signal }: { signal: AbortSignal },
): Promise<{
  name: string
  description: string
  unit: string
  periodicity: SeriesPeriodicity
  source: { name: string; url: string }
  theme: string
  minDate: Date
  maxDate: Date
  isActive: boolean
  lastUpdatedAt: Date
  country: string
  countryName: string
  database: SeriesDatabase
  decimalPlaces: number
  regionalLevels: RegionalLevel[]
  possibleDates: Date[]
}> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/Metadados('${code}')`)
  const [response, countries] = await Promise.all([
    fetch(url, { signal }),
    getCountries({ signal }),
  ])
  if (!response.ok) {
    throw new Error('Failed to fetch series metadata')
  }

  const json = await response.json()
  const result = dataSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected data format: ${result.error}`)
  }

  const value = result.data.value[0]
  if (!value) {
    throw new Error(`Unexpectedly missing value: ${result.data}`)
  }

  const database = mapDatabase(value.BASNOME)
  const regionalLevels: RegionalLevel[] = []
  if (value.SERTEMBR === 1) regionalLevels.push('brazil')
  if (value.SERTEMMET === 1) regionalLevels.push('regions')
  if (value.SERTEMEST === 1) regionalLevels.push('states')
  if (value.SERTEMMUN === 1) regionalLevels.push('municipalities')

  let possibleDates: Date[] = []
  if (regionalLevels.length > 0) {
    possibleDates = await getSeriesDates(code, { signal })
  }

  const countryCode =
    database === 'macroeconomic' ? (value.PAICODIGO ?? 'BRA') : 'BRA'
  const countryName = countries[countryCode] ?? countryCode

  return {
    name: value.SERNOME,
    unit: value.UNINOME === '-' ? '' : value.UNINOME,
    description: value.SERCOMENTARIO,
    periodicity: mapPeriodicity(value.PERNOME),
    source: { name: value.FNTNOME || value.FNTNOME || '', url: value.FNTURL },
    theme: value.TEMNOME,
    minDate: parse(removeTime(value.SERMINDATA), 'yyyy-MM-dd', new Date()),
    maxDate: parse(removeTime(value.SERMAXDATA), 'yyyy-MM-dd', new Date()),
    isActive: value.SERSTATUS === null || value.SERSTATUS === 'A',
    lastUpdatedAt: new Date(value.SERATUALIZACAO),
    country: countryCode,
    countryName,
    database,
    decimalPlaces: value.SERDECIMAIS,
    regionalLevels,
    possibleDates,
  }
}

function removeTime(s: string) {
  // Ignore UTC time portion, parse it as an absolute date since the offset is often inconsistent and can wrap days around
  return s.slice(0, s.indexOf('T'))
}
