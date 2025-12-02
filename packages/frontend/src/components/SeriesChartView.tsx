import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import { useSelectedRegionalDivision } from '../hooks/useSelectedRegionalLevel'
import { useSelectedRegion } from '../hooks/useSelectedRegion'
import { useTransition } from 'react'
import { useDateFilters } from '../hooks/useDateFilters'
import { getDateRangePresets } from '../utils/get-date-ranges-presets'
import { formatByPeriodicity } from '../utils/format-date-by-periodicity'
import { RegionSelect } from './RegionSelect'
import { SeriesDataFilterGroup } from './SeriesDataFilterGroup'
import { SeriesDataFilterItem } from './SeriesDataFilterItem'
import { SegmentGroup } from './SegmentGroup'
import { SegmentGroupItem } from './SegmentGroupItem'
import { displayRegionalLevel } from '../utils/display-regional-level'
import { DateRangeFilter } from './DateRangeFilter'
import { Select } from './Select'
import { SeriesDataFilterItemLabel } from './SeriesDataFilterItemLabel'
import { FILTER_LABELS } from '../consts'
import { getChartType } from '../utils/get-chart-type'
import { getDefaultDateFilter } from '../utils/get-default-date-filter'
import { ChartContext } from '../context/ChartContext'
import { useContainerWidth } from '../hooks/useContainerWidth'
import { SeriesChart } from './SeriesChart'
import { findClosestDate } from '../utils/find-closest-date'
import { getCssVariable } from '../utils/get-css-variable'
import useMediaQuery from '../hooks/useMediaQuery'

interface Props {
  code: string
}

export function SeriesChartView({ code }: Props) {
  const [, startTransition] = useTransition()
  const metadata = useSeriesMetadataContext()

  const [selectedRegionalDivision, setSelectedRegionalLevel] =
    useSelectedRegionalDivision(metadata.regionalLevels[0] ?? 'brazil')

  const [selectedRegion, setSelectedRegion] = useSelectedRegion()

  const isRegionalSeries =
    metadata.database === 'regional' || metadata.database === 'social'

  const chartType = getChartType({
    database: metadata.database,
    regionalDivision: selectedRegionalDivision,
  })

  const dateRangePresets = getDateRangePresets({
    periodicity: metadata.periodicity,
    minDate: metadata.minDate,
    maxDate: metadata.maxDate,
  })

  const shouldShowDateRange = (
    targetRegionalDivision: typeof selectedRegionalDivision,
  ) => {
    if (isRegionalSeries) {
      return (
        targetRegionalDivision === 'brazil' ||
        targetRegionalDivision === 'regions'
      )
    }
    return true
  }

  const { dateFilter: dateFilterValue, setDateFilter } = useDateFilters({
    defaultValue: getDefaultDateFilter({
      chartType,
      periodicity: metadata.periodicity,
      minDate: metadata.minDate,
      maxDate: metadata.maxDate,
      possibleDates: metadata.possibleDates,
    }),
  })

  let startDate = dateFilterValue.startDate
  let endDate = dateFilterValue.endDate

  if (chartType === 'map') {
    const closestDate =
      findClosestDate(metadata.possibleDates, startDate) ?? metadata.maxDate
    startDate = closestDate
    endDate = closestDate
  }

  const dateFilter = {
    startDate,
    endDate,
    preset: dateFilterValue.preset,
  }

  const shouldShowRegionalLevelFilter = metadata.regionalLevels.length > 1

  const isLargeScreen = useMediaQuery(
    `(min-width: ${getCssVariable('--breakpoint-lg')})`,
  )

  const { containerRef, width } = useContainerWidth()
  const chartContext =
    chartType === 'map'
      ? {
          backgroundColor: getCssVariable('--color-surface-primary'),
          width,
          height: isLargeScreen ? 720 : 460,
          marginTop: 0,
          marginBottom: 60,
          marginLeft: 0,
          marginRight: 0,
        }
      : {
          backgroundColor: getCssVariable('--color-surface-primary'),
          width,
          height: 400,
          marginTop: 30,
          marginBottom: 30,
          marginLeft: 40,
          marginRight: 0,
        }

  return (
    <>
      <SeriesDataFilterGroup className='mb-6'>
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
                      setSelectedRegionalLevel(regionalLevel)
                      setDateFilter(
                        getDefaultDateFilter({
                          chartType: chartType,
                          periodicity: metadata.periodicity,
                          minDate: metadata.minDate,
                          maxDate: metadata.maxDate,
                          possibleDates: metadata.possibleDates,
                        }),
                      )
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

          {shouldShowDateRange(selectedRegionalDivision) ? (
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
          ) : (
            <Select
              isMultiple={false}
              options={metadata.possibleDates.map((date) => ({
                value: String(date.getTime()),
                label: formatByPeriodicity(date, metadata.periodicity),
              }))}
              value={String(dateFilter.startDate.getTime())}
              onChange={(value) => {
                startTransition(() => {
                  setDateFilter({
                    preset: 'custom',
                    startDate: new Date(Number(value)),
                    endDate: new Date(Number(value)),
                  })
                })
              }}
            />
          )}
        </SeriesDataFilterItem>
      </SeriesDataFilterGroup>

      <ChartContext.Provider value={chartContext}>
        <div ref={containerRef}>
          <SeriesChart
            code={code}
            startDate={dateFilter.startDate}
            endDate={dateFilter.endDate}
            regionalDivision={selectedRegionalDivision}
            title={metadata.name}
            region={selectedRegion}
            className='view-transition-[series-chart]'
          />
        </div>
      </ChartContext.Provider>
    </>
  )
}
