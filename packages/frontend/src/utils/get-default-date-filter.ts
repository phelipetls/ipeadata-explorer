import { getDateRangePresets } from './get-date-ranges-presets'
import type { SeriesPeriodicity } from '../types'

type ChartType = 'line' | 'map'

export function getDefaultDateFilter({
  chartType,
  periodicity,
  minDate,
  maxDate,
  possibleDates,
}: {
  chartType: ChartType
  periodicity: SeriesPeriodicity
  minDate: Date
  maxDate: Date
  possibleDates: Date[]
}) {
  if (chartType === 'line') {
    const presets = getDateRangePresets({
      periodicity,
      minDate,
      maxDate,
    })

    return {
      startDate: presets[0]?.startDate ?? minDate,
      endDate: presets[0]?.endDate ?? maxDate,
      preset: presets[0]?.label ?? 'custom',
    }
  }

  const latestDate = possibleDates.at(-1) ?? maxDate
  return {
    startDate: latestDate,
    endDate: latestDate,
    preset: 'custom',
  }
}
