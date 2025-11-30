import { SeriesTable } from './SeriesTable'
import { format, compareDesc } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { SeriesPeriodicity } from '../types'
import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import { useTransition } from 'react'
import { displayRegionalLevel } from '../utils/display-regional-level'
import { SegmentGroup } from './SegmentGroup'
import { SegmentGroupItem } from './SegmentGroupItem'
import { useDateFilters } from '../hooks/useDateFilters'
import { useQuery } from '@tanstack/react-query'
import { getSeriesValues } from '../api/ipea/get-series-values'
import { DateRangeFilter } from './DateRangeFilter'
import { getDateRangePresets } from '../utils/get-date-ranges-presets'
import { SeriesDataFilterGroup } from './SeriesDataFilterGroup'
import { SeriesDataFilterItem } from './SeriesDataFilterItem'
import { useSelectedRegionalDivision } from '../hooks/useSelectedRegionalLevel'
import { FILTER_LABELS } from '../consts'
import { SeriesDataFilterItemLabel } from './SeriesDataFilterItemLabel'
import { LoadingIndicator } from './LoadingIndicator'
import clsx from 'clsx'

interface Props {
  code: string
}

export function SeriesTableView({ code }: Props) {
  const [isPending, startTransition] = useTransition()
  const metadata = useSeriesMetadataContext()

  const [selectedRegionalDivision, setSelectedRegionalDivision] =
    useSelectedRegionalDivision(metadata.regionalLevels[0] ?? 'brazil')

  const dateRangePresets = getDateRangePresets({
    periodicity: metadata.periodicity,
    minDate: metadata.minDate,
    maxDate: metadata.maxDate,
  })

  const { dateFilter, setDateFilter } = useDateFilters({
    defaultValue: {
      startDate: dateRangePresets[0]?.startDate ?? metadata.minDate,
      endDate: dateRangePresets[0]?.endDate ?? metadata.maxDate,
      preset: dateRangePresets[0]?.label ?? 'custom',
    },
  })

  const dataQuery = useQuery({
    queryKey: [
      'seriesData',
      code,
      selectedRegionalDivision,
      dateFilter.startDate.getTime(),
      dateFilter.endDate.getTime(),
      'table',
    ],
    queryFn: ({ signal }) =>
      getSeriesValues(code, {
        signal,
        regionalLevel:
          metadata.database === 'macroeconomic'
            ? undefined
            : selectedRegionalDivision,
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate,
      }),
    enabled: code !== '',
    placeholderData: (prev) => prev,
  })

  const data = dataQuery.data ?? []

  let tableRows: (string | Date | number | null)[][] = []

  const isRegionalData = data.some((v) => v.region != null)

  if (isRegionalData) {
    const dataMap = new Map<number, Map<string, number | null>>()
    const regionSet = new Set<string>()

    for (const item of data) {
      const regionKey = item.region?.name ?? 'default'
      regionSet.add(regionKey)

      const dateKey = item.date.getTime()
      if (!dataMap.has(dateKey)) dataMap.set(dateKey, new Map())
      dataMap.get(dateKey)!.set(regionKey, item.value)
    }

    const regionNames = Array.from(regionSet).sort()
    const allDates = Array.from(dataMap.keys())
      .sort((a, b) => b - a)
      .map((timestamp) => new Date(timestamp))

    tableRows = [
      ['Região', ...allDates.map((date) => formatHtmlCell(date, metadata))],
      ...regionNames.map((regionName) => [
        regionName,
        ...allDates.map(
          (date) => dataMap.get(date.getTime())?.get(regionName) ?? null,
        ),
      ]),
    ]
  } else {
    tableRows = [
      ['Data', `${metadata.name} ${metadata.unit}`],
      ...[...data]
        .sort((a, b) => compareDesc(a.date, b.date))
        .map(({ date, value }) => [date, value]),
    ]
  }

  const shouldShowRegionalLevelFilter = metadata.regionalLevels.length > 1

  return (
    <>
      <SeriesDataFilterGroup className='mb-4'>
        {shouldShowRegionalLevelFilter && (
          <SeriesDataFilterItem>
            <SeriesDataFilterItemLabel>
              {FILTER_LABELS.regionalDivision}
            </SeriesDataFilterItemLabel>

            <SegmentGroup>
              {metadata.regionalLevels.map((regionalLevel) => (
                <SegmentGroupItem
                  key={regionalLevel}
                  isSelected={regionalLevel === selectedRegionalDivision}
                  onClick={() => {
                    startTransition(() => {
                      setSelectedRegionalDivision(regionalLevel)
                    })
                  }}
                >
                  {displayRegionalLevel(regionalLevel)}
                </SegmentGroupItem>
              ))}
            </SegmentGroup>
          </SeriesDataFilterItem>
        )}

        <SeriesDataFilterItem>
          <SeriesDataFilterItemLabel>
            {FILTER_LABELS.date}
          </SeriesDataFilterItemLabel>

          <DateRangeFilter
            dateRangePresets={dateRangePresets}
            value={dateFilter}
            onChange={(value) => {
              startTransition(() => {
                setDateFilter(value)
              })
            }}
            minDate={metadata.minDate}
            maxDate={metadata.maxDate}
          />
        </SeriesDataFilterItem>
      </SeriesDataFilterGroup>

      {dataQuery.isLoading ? (
        <div className='h-[400px] grid place-items-center'>
          <LoadingIndicator />
        </div>
      ) : (
        <SeriesTable
          className={clsx(isPending && 'opacity-75')}
          rows={tableRows.map((row) =>
            row.map((v) => formatHtmlCell(v, metadata)),
          )}
        />
      )}
    </>
  )
}

function formatHtmlCell(
  cell: string | Date | number | null,
  metadata: {
    decimalPlaces: number
    unit: string
    periodicity: SeriesPeriodicity
  },
) {
  if (cell === null) {
    return '-'
  }
  if (typeof cell === 'string') {
    return cell
  }
  if (cell instanceof Date) {
    const periodicity = metadata.periodicity

    switch (periodicity) {
      case 'decennial':
      case 'quadrennial':
      case 'yearly':
        return format(cell, 'yyyy', { locale: ptBR })
      case 'quarterly':
        return format(cell, 'QQQ yyyy', { locale: ptBR })
      case 'monthly':
        return format(cell, 'MMM yyyy', { locale: ptBR })
      case 'daily':
        return format(cell, 'dd MMM yyyy', { locale: ptBR })
      default:
        periodicity satisfies never
    }

    return format(cell, 'yyyy-MM-dd')
  }
  if (typeof cell === 'number') {
    const numberFormatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: metadata.decimalPlaces,
      maximumFractionDigits: metadata.decimalPlaces,
    })
    const formattedNumber = numberFormatter.format(cell)
    if (metadata.unit.includes('%')) {
      return formattedNumber + '%'
    }
    return formattedNumber
  }
  return '-'
}
