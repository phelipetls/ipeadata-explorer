import type { RawSeriesMetadata } from '../api/ipea/get-series-metadata'
import type { SeriesDatabase, SeriesPeriodicity } from '../types'

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

function mapDatabase(basnome: string): SeriesDatabase {
  return databaseMap[basnome] || 'macroeconomic'
}

export type SeriesMetadata = {
  name: string
  description: string
  unit: string
  periodicity: SeriesPeriodicity
  source: { name: string; url: string }
  themeCode: number | null
  isActive: boolean
  lastUpdatedAt: Date
  countryCode: string
  database: SeriesDatabase
  decimalPlaces: number
}

export function formatSeriesMetadata(
  rawMeta: RawSeriesMetadata,
): SeriesMetadata {
  const database = mapDatabase(rawMeta.BASNOME || '')

  return {
    name: rawMeta.SERNOME,
    unit: !rawMeta.UNINOME || rawMeta.UNINOME === '-' ? '' : rawMeta.UNINOME,
    description: rawMeta.SERCOMENTARIO || '',
    periodicity: mapPeriodicity(rawMeta.PERNOME || ''),
    source: {
      name: rawMeta.FNTNOME || rawMeta.FNTSIGLA || '',
      url: rawMeta.FNTURL || '',
    },
    themeCode: rawMeta.TEMCODIGO ?? null,
    isActive: rawMeta.SERSTATUS === null || rawMeta.SERSTATUS === 'A',
    lastUpdatedAt: rawMeta.SERATUALIZACAO
      ? new Date(rawMeta.SERATUALIZACAO)
      : new Date(),
    countryCode:
      database === 'macroeconomic' ? (rawMeta.PAICODIGO ?? 'BRA') : 'BRA',
    database,
    decimalPlaces: 2,
  }
}
