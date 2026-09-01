import { SeriesChart } from './SeriesChart'
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorState } from './ErrorState'
import { SeriesMetadataProvider } from '../context/SeriesMetadataContext'
import { ChartContext } from '../context/ChartContext'
import { useContainerWidth } from '../hooks/useContainerWidth'
import { useSeriesMetadataQuery } from '../hooks/useSeriesMetadataQuery'
import { useSeriesDateRange } from '../hooks/useSeriesDateRange'
import type { SeriesItem } from '../views/Home'
import clsx from 'clsx'
import { getCssVariable } from '../utils/get-css-variable'
import { formatDateByPeriodicity } from '../utils/format-date-by-periodicity'
import { formatDateRange } from '../utils/format-date-range'
import { BRAZIL_LOCATION_CODE } from '../consts'

interface Props {
  selectedSeries: SeriesItem
  className?: string
  dimensions: {
    height: number
    marginTop: number
    marginLeft: number
    marginRight: number
    marginBottom: number
  }
}

export function HomeSeriesChartSection({
  selectedSeries,
  className,
  dimensions,
}: Props) {
  const { width, containerRef } = useContainerWidth()

  const metadataQuery = useSeriesMetadataQuery(selectedSeries.code)
  const { minDate, maxDate, isLoading: isDateRangeLoading, error: dateRangeError } =
    useSeriesDateRange(selectedSeries.code)

  const metadata = metadataQuery.data
  const regionalDivision = selectedSeries.regionalDivision

  const dateRange =
    metadata && selectedSeries.getDateRange
      ? selectedSeries.getDateRange(maxDate)
      : null

  const formattedDateRange = metadata
    ? formatDateRange(
        dateRange?.startDate ?? minDate,
        dateRange?.endDate ?? maxDate,
        (date) => formatDateByPeriodicity(date, metadata.periodicity),
      )
    : ''

  const chartTitle = metadata ? `${metadata.name} (${formattedDateRange})` : ''

  const chartBackgroundColor = getCssVariable('--color-surface-tertiary')

  const chartContext = {
    width,
    backgroundColor: chartBackgroundColor,
    ...dimensions,
  }

  const isError = metadataQuery.isError || !!dateRangeError
  const isLoading = metadataQuery.isLoading || isDateRangeLoading || !metadata

  return (
    <div
      style={{ backgroundColor: chartBackgroundColor }}
      className={clsx('rounded-xl', className)}
    >
      <div ref={containerRef} className='w-full'>
        {isError ? (
          <div
            className='grid place-items-center'
            style={{
              width: chartContext.width,
              height: chartContext.height,
            }}
          >
            <ErrorState
              isCentered
              title='Ocorreu um erro'
              description='Não foi possível obter os metadados da série. Por favor, tente novamente mais tarde.'
              retry={() => metadataQuery.refetch()}
            />
          </div>
        ) : isLoading ? (
          <div
            className='grid place-items-center'
            style={{
              width: chartContext.width,
              height: chartContext.height,
            }}
          >
            <LoadingIndicator />
          </div>
        ) : (
          <SeriesMetadataProvider metadata={metadata}>
            <ChartContext.Provider value={chartContext}>
              <SeriesChart
                code={selectedSeries.code}
                title={chartTitle}
                startDate={dateRange?.startDate ?? minDate}
                endDate={dateRange?.endDate ?? maxDate}
                regionalDivision={regionalDivision}
                regionCode={BRAZIL_LOCATION_CODE}
              />
            </ChartContext.Provider>
          </SeriesMetadataProvider>
        )}
      </div>
    </div>
  )
}
