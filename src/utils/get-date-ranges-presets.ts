import {
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns'
import type { DateRangePreset, SeriesPeriodicity } from '../types'

const PRESET_CONFIGS: Record<
  SeriesPeriodicity,
  Array<{
    label: string
    longLabel: string
    getStartDate: (date: Date) => Date
  }>
> = {
  daily: [
    {
      label: '1W',
      longLabel: 'Última semana',
      getStartDate: (date) => startOfDay(subDays(date, 6)),
    },
    {
      label: '1M',
      longLabel: 'Último mês',
      getStartDate: (date) => startOfDay(subMonths(date, 1)),
    },
    {
      label: '3M',
      longLabel: 'Últimos 3 meses',
      getStartDate: (date) => startOfDay(subMonths(date, 3)),
    },
    {
      label: '6M',
      longLabel: 'Últimos 6 meses',
      getStartDate: (date) => startOfDay(subMonths(date, 6)),
    },
    {
      label: 'YTD',
      longLabel: 'Desde o início do ano',
      getStartDate: () => startOfYear(new Date()),
    },
    {
      label: '1Y',
      longLabel: 'Último ano',
      getStartDate: (date) => startOfDay(subYears(date, 1)),
    },
    {
      label: '5Y',
      longLabel: 'Últimos 5 anos',
      getStartDate: (date) => startOfDay(subYears(date, 5)),
    },
  ],
  monthly: [
    {
      label: '3M',
      longLabel: 'Últimos 3 meses',
      getStartDate: (date) => subMonths(startOfMonth(date), 2),
    },
    {
      label: '6M',
      longLabel: 'Últimos 6 meses',
      getStartDate: (date) => subMonths(startOfMonth(date), 5),
    },
    {
      label: 'YTD',
      longLabel: 'Desde o início do ano',
      getStartDate: () => startOfYear(new Date()),
    },
    {
      label: '1Y',
      longLabel: 'Último ano',
      getStartDate: (date) => startOfMonth(subYears(date, 1)),
    },
    {
      label: '5Y',
      longLabel: 'Últimos 5 anos',
      getStartDate: (date) => startOfMonth(subYears(date, 5)),
    },
    {
      label: '10Y',
      longLabel: 'Últimos 10 anos',
      getStartDate: (date) => startOfMonth(subYears(date, 10)),
    },
  ],
  quarterly: [
    {
      label: '2Q',
      longLabel: 'Últimos 2 trimestres',
      getStartDate: (date) => subQuarters(startOfQuarter(date), 1),
    },
    {
      label: '4Q',
      longLabel: 'Últimos 4 trimestres',
      getStartDate: (date) => subQuarters(startOfQuarter(date), 3),
    },
    {
      label: 'YTD',
      longLabel: 'Desde o início do ano',
      getStartDate: () => startOfYear(new Date()),
    },
    {
      label: '2Y',
      longLabel: 'Últimos 2 anos',
      getStartDate: (date) => subYears(startOfYear(date), 1),
    },
    {
      label: '5Y',
      longLabel: 'Últimos 5 anos',
      getStartDate: (date) => subYears(startOfYear(date), 4),
    },
  ],
  yearly: [
    {
      label: '5Y',
      longLabel: 'Últimos 5 anos',
      getStartDate: (date) => startOfYear(subYears(date, 5)),
    },
    {
      label: '10Y',
      longLabel: 'Últimos 10 anos',
      getStartDate: (date) => startOfYear(subYears(date, 10)),
    },
    {
      label: '20Y',
      longLabel: 'Últimos 20 anos',
      getStartDate: (date) => startOfYear(subYears(date, 20)),
    },
  ],
  quadrennial: [
    {
      label: '8Y',
      longLabel: 'Últimos 8 anos',
      getStartDate: (date) => startOfYear(subYears(date, 8)),
    },
    {
      label: '20Y',
      longLabel: 'Últimos 20 anos',
      getStartDate: (date) => startOfYear(subYears(date, 20)),
    },
    {
      label: '40Y',
      longLabel: 'Últimos 40 anos',
      getStartDate: (date) => startOfYear(subYears(date, 40)),
    },
  ],
  decennial: [
    {
      label: '20Y',
      longLabel: 'Últimos 20 anos',
      getStartDate: (date) => startOfYear(subYears(date, 20)),
    },
    {
      label: '50Y',
      longLabel: 'Últimos 50 anos',
      getStartDate: (date) => startOfYear(subYears(date, 50)),
    },
    {
      label: '100Y',
      longLabel: 'Últimos 100 anos',
      getStartDate: (date) => startOfYear(subYears(date, 100)),
    },
  ],
}

export function getDateRangePresets(options: {
  periodicity: SeriesPeriodicity
  minDate: Date
  maxDate: Date
}): DateRangePreset[] {
  const { periodicity, minDate, maxDate } = options

  const presets: DateRangePreset[] = PRESET_CONFIGS[periodicity].map(
    (preset) => {
      const startDate = preset.getStartDate(maxDate)
      const isAvailable = startDate >= minDate && startDate <= maxDate
      return {
        label: preset.label,
        longLabel: preset.longLabel,
        startDate,
        endDate: maxDate,
        isAvailable,
      }
    },
  )

  presets.push({
    label: 'Max',
    longLabel: 'Todo o período',
    startDate: minDate,
    endDate: maxDate,
    isAvailable: true,
  })

  return presets
}
