import { useMemo } from 'react'
import { useSeriesRawValuesQuery } from './useSeriesRawValuesQuery'
import { useRegionsQuery } from './useRegionsQuery'
import { parseDate } from '../utils/parse-date'
import { getIpeaRegionalLevel } from '../utils/get-ipea-regional-level'
import type { RegionalLevel } from '../types'

type Options = {
  regionalLevel?: RegionalLevel
  regions?: string[]
  startDate?: Date
  endDate?: Date
}

type SeriesValueItem = {
  date: Date
  value: number | null
  region?: {
    name: string
    code: number
  }
}

export function useSeriesValues(code: string, options: Options = {}) {
  const { startDate, endDate, regions = [], regionalLevel } = options

  const regionsQuery = useRegionsQuery()
  const valuesQuery = useSeriesRawValuesQuery(code)

  const isLoading = valuesQuery.isLoading || regionsQuery.isLoading
  const error = valuesQuery.error || regionsQuery.error

  const data = useMemo<SeriesValueItem[] | undefined>(() => {
    if (!valuesQuery.data) return undefined

    const rawValues = valuesQuery.data
    const regionsMap = regionsQuery.data || {}

    return (
      rawValues
        // Filter by regional level
        .filter((item) => {
          if (!regionalLevel) return true
          return regionalLevel === getIpeaRegionalLevel(item.NIVNOME)
        })
        // Parse date and filter invalid / out-of-range
        .filter((item) => {
          const date = parseDate(item.VALDATA)
          if (!date) return false
          if (startDate && date < startDate) return false
          if (endDate && date > endDate) return false
          return true
        })
        // Filter by specific region names
        .filter((item) => {
          if (regions.length === 0) return true
          const territoryCode = item.TERCODIGO || ''
          const regionName = regionsMap[territoryCode]
          return regions.includes(regionName || territoryCode)
        })
        // Map to SeriesValueItem
        .map((item): SeriesValueItem => {
          const territoryCode = item.TERCODIGO || ''
          const regionName = regionsMap[territoryCode]
          const hasRegion = Boolean(territoryCode) && territoryCode !== '0'

          return {
            date: parseDate(item.VALDATA)!,
            value: item.VALVALOR,
            ...(hasRegion && {
              region: {
                name: regionName || territoryCode,
                code: Number(territoryCode) || 0,
              },
            }),
          }
        })
    )
  }, [
    valuesQuery.data,
    regionsQuery.data,
    startDate,
    endDate,
    regions,
    regionalLevel,
  ])

  return {
    data,
    isLoading,
    error,
    refetch: valuesQuery.refetch,
  }
}
