import type { FeatureCollection, Geometry } from 'geojson'
import type { REGIONAL_LEVELS } from './consts'

export type SeriesPeriodicity =
  | 'daily'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'quadrennial'
  | 'decennial'

export type SeriesDatabase = 'macroeconomic' | 'regional' | 'social'

export type RegionalLevel = (typeof REGIONAL_LEVELS)[number]

export interface DateRangePreset {
  label: string
  longLabel: string
  startDate: Date
  endDate: Date
  isAvailable: boolean
}

export type IbgeGeoJson = FeatureCollection<
  Geometry,
  {
    code: number
    name: string
    stateCode: number | null
    stateName: string | null
    regionCode: number | null
    regionName: string | null
  }
>
