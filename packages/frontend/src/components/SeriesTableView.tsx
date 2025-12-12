import { SeriesTable } from './SeriesTable'
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
import { SeriesTableCellContent } from './SeriesTableCellContent'
import { SeriesTableCellSortableContent } from './SeriesTableCellSortableContent'
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs'

interface Props {
  code: string
}

export function SeriesTableView({ code }: Props) {
  const [isPending, startTransition] = useTransition()
  const metadata = useSeriesMetadataContext()

  const [selectedRegionalDivision, setSelectedRegionalDivision] =
    useSelectedRegionalDivision(metadata.regionalLevels[0] ?? 'brazil')
  const [selectedRegion, setSelectedRegion] = useSelectedRegion()

  const [sortConfig, setSortConfig] = useQueryStates({
    sortByColumnIndex: parseAsInteger.withDefault(0),
    sortDirection: parseAsStringLiteral(['asc', 'desc', 'none']).withDefault(
      'asc',
    ),
  })

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

  let tableRows = []

  const regionNamesSet = new Set<string>()
  const dates: Date[] = []
  const seenTimestamps = new Set<number>()

  for (const item of deferredData) {
    if (item.region) {
      regionNamesSet.add(item.region.name)
    }

    const time = item.date.getTime()
    if (!seenTimestamps.has(time)) {
      seenTimestamps.add(time)
      dates.push(item.date)
    }
  }

  const regionNames = [...regionNamesSet]

  if (regionNames.length > 1) {
    const dataMap = new Map<`${number}-${string}`, number | null>()

    for (const item of deferredData) {
      dataMap.set(
        `${item.date.getTime()}-${item.region?.name ?? 'default'}`,
        item.value,
      )
    }

    const sortedRegionNames = regionNames.sort((regionA, regionB) => {
      if (sortConfig.sortByColumnIndex === 0) {
        if (sortConfig.sortDirection === 'asc') {
          return regionA.localeCompare(regionB)
        }
        if (sortConfig.sortDirection === 'desc') {
          return regionB.localeCompare(regionA)
        }
      }

      const dateIndex = sortConfig.sortByColumnIndex - 1
      const date = dates[dateIndex]
      if (date) {
        const timestamp = date.getTime()
        const valueA = dataMap.get(`${timestamp}-${regionA}`) ?? 0
        const valueB = dataMap.get(`${timestamp}-${regionB}`) ?? 0

        if (sortConfig.sortDirection === 'asc') {
          return valueA - valueB
        }
        if (sortConfig.sortDirection === 'desc') {
          return valueB - valueA
        }
      }

      return 0
    })

    const selectedRegionalDivisionLabel = displayRegionalLevel(
      selectedRegionalDivision,
      {
        plural: false,
      },
    )

    tableRows = [
      {
        id: 'header',
        cells: [
          {
            id: `header-region-${selectedRegionalDivisionLabel}`,
            element: (
              <SeriesTableCellSortableContent
                value={
                  sortConfig.sortByColumnIndex === 0
                    ? sortConfig.sortDirection
                    : 'none'
                }
                onChange={(dir) =>
                  setSortConfig({ sortByColumnIndex: 0, sortDirection: dir })
                }
              >
                <SeriesTableCellContent>
                  {selectedRegionalDivisionLabel}
                </SeriesTableCellContent>
              </SeriesTableCellSortableContent>
            ),
          },
          ...dates.map((date, index) => {
            const columnIndex = index + 1
            const timestamp = date.getTime()
            return {
              id: `header-${timestamp}`,
              element: (
                <SeriesTableCellSortableContent
                  value={
                    sortConfig.sortByColumnIndex === columnIndex
                      ? sortConfig.sortDirection
                      : 'none'
                  }
                  onChange={(dir) =>
                    setSortConfig({
                      sortByColumnIndex: columnIndex,
                      sortDirection: dir,
                    })
                  }
                >
                  <SeriesTableCellContent>{date}</SeriesTableCellContent>
                </SeriesTableCellSortableContent>
              ),
            }
          }),
        ],
      },
      ...sortedRegionNames.map((regionName) => ({
        id: regionName,
        cells: [
          {
            id: `header-${regionName}`,
            element: (
              <SeriesTableCellContent>{regionName}</SeriesTableCellContent>
            ),
          },
          ...dates.map((date) => ({
            id: `value-${date.getTime()}-${regionName}`,
            element: (
              <SeriesTableCellContent>
                {dataMap.get(`${date.getTime()}-${regionName}`) ?? null}
              </SeriesTableCellContent>
            ),
          })),
        ],
      })),
    ]
  } else {
    tableRows = [
      {
        id: 'header',
        cells: [
          {
            id: 'header-date',
            element: (
              <SeriesTableCellSortableContent
                value={
                  sortConfig.sortByColumnIndex === 0
                    ? sortConfig.sortDirection
                    : 'none'
                }
                onChange={(dir) =>
                  setSortConfig({ sortByColumnIndex: 0, sortDirection: dir })
                }
              >
                <SeriesTableCellContent>Data</SeriesTableCellContent>
              </SeriesTableCellSortableContent>
            ),
          },
          {
            id: 'header-value',
            element: (
              <SeriesTableCellSortableContent
                value={
                  sortConfig.sortByColumnIndex === 1
                    ? sortConfig.sortDirection
                    : 'none'
                }
                onChange={(dir) =>
                  setSortConfig({ sortByColumnIndex: 1, sortDirection: dir })
                }
              >
                <SeriesTableCellContent>
                  {`${metadata.name} ${metadata.unit}`}
                </SeriesTableCellContent>
              </SeriesTableCellSortableContent>
            ),
          },
        ],
      },
      ...deferredData
        .sort((a, b) => {
          if (sortConfig.sortByColumnIndex === 1) {
            const valueA = a.value ?? 0
            const valueB = b.value ?? 0

            if (sortConfig.sortDirection === 'asc') {
              return valueA - valueB
            }
            if (sortConfig.sortDirection === 'desc') {
              return valueB - valueA
            }
          }

          if (sortConfig.sortByColumnIndex === 0) {
            if (sortConfig.sortDirection === 'asc') {
              return a.date.getTime() - b.date.getTime()
            }
            if (sortConfig.sortDirection === 'desc') {
              return b.date.getTime() - a.date.getTime()
            }
          }

          return 0
        })
        .map((item) => ({
          id: item.date.toISOString(),
          cells: [
            {
              id: `header-${item.date.getTime()}`,
              element: (
                <SeriesTableCellContent>{item.date}</SeriesTableCellContent>
              ),
            },
            {
              id: `data-${item.date.getTime()}-${item.value}`,
              element: (
                <SeriesTableCellContent>{item.value}</SeriesTableCellContent>
              ),
            },
          ],
        })),
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
          rows={tableRows}
        />
      )}
    </>
  )
}
