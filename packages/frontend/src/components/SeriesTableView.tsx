import { SeriesTable } from './SeriesTable'
import { format, compareDesc } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { SeriesPeriodicity } from '../types'
import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import { useDeferredValue, useTransition } from 'react'
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
import { RegionSelect } from './RegionSelect'
import { useSelectedRegion } from '../hooks/useSelectedRegion'
import { getContainingLocations } from '../utils/get-containing-locations'

interface Props {
  code: string
}

export function SeriesTableView({ code }: Props) {
  const [isPending, startTransition] = useTransition()
  const metadata = useSeriesMetadataContext()

  const [selectedRegionalDivision, setSelectedRegionalDivision] =
    useSelectedRegionalDivision(metadata.regionalLevels[0] ?? 'brazil')
  const [selectedRegion, setSelectedRegion] = useSelectedRegion()

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
  let deferredData = useDeferredValue(data)
  deferredData = deferredData.filter((item) => {
    return item.region
      ? getContainingLocations(selectedRegion).has(item.region.code)
      : true
  })

  let tableRows: (string | Date | number | null)[][] = []

  const regionNames = deferredData.flatMap((item) =>
    item.region ? [item.region.name] : [],
  )

  if (regionNames.length > 1) {
    const dataMap = new Map<`${number}:${string}`, number | null>()

    for (const item of deferredData) {
      dataMap.set(
        `${item.date.getTime()}:${item.region?.name ?? 'default'}`,
        item.value,
      )
    }

    const timestamps = [
      ...new Set(deferredData.map((item) => item.date.getTime())),
    ].sort((a, b) => a - b)

    tableRows = [
      [
        displayRegionalLevel(selectedRegionalDivision, { plural: false }),
        ...timestamps.map((timestamp) =>
          formatHtmlCell(new Date(timestamp), metadata),
        ),
      ],
      ...regionNames.map((regionName) => [
        formatHtmlCell(regionName, metadata),
        ...timestamps.map((timestamp) =>
          formatHtmlCell(
            dataMap.get(`${timestamp}:${regionName}`) ?? null,
            metadata,
          ),
        ),
      ]),
    ]
  } else {
    tableRows = [
      ['Data', `${metadata.name} ${metadata.unit}`],
      ...deferredData
        .sort((a, b) => compareDesc(a.date, b.date))
        .map((item) => [
          formatHtmlCell(item.date, metadata),
          formatHtmlCell(item.value, metadata),
        ]),
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

        {['municipalities', 'states'].includes(selectedRegionalDivision) && (
          <SeriesDataFilterItem>
            <SeriesDataFilterItemLabel>
              {FILTER_LABELS.region}
            </SeriesDataFilterItemLabel>
            <RegionSelect
              value={selectedRegion}
              regionalDivision={selectedRegionalDivision}
              onChange={(value) => {
                startTransition(() => {
                  setSelectedRegion(value)
                })
              }}
            />
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
          className={clsx((isPending || data !== deferredData) && 'opacity-75')}
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
