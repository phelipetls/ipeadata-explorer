import { useQuery } from '@tanstack/react-query'
import { SeriesChart } from './SeriesChart'
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorState } from './ErrorState'
import { SeriesMetadataProvider } from '../context/SeriesMetadataContext'
import { ChartContext } from '../context/ChartContext'
import { useContainerWidth } from '../hooks/useContainerWidth'
import { getSeriesMetadata } from '../api/ipea/get-series-metadata'
import type { SeriesItem } from '../views/Home'
import clsx from 'clsx'

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

  const seriesMetadataQuery = useQuery({
    queryKey: ['seriesMetadata', selectedSeries.code],
    queryFn: ({ signal }) => getSeriesMetadata(selectedSeries.code, { signal }),
  })

  const metadata = seriesMetadataQuery.data
  const regionalDivision = selectedSeries.regionalDivision

  const dateRange =
    metadata && selectedSeries.getDateRange
      ? selectedSeries.getDateRange(metadata.maxDate)
      : null

  const chartDimensions = {
    width,
    ...dimensions,
  }

  return (
    <div className={clsx('bg-surface-tertiary p-6 rounded-xl', className)}>
      <div ref={containerRef} className='w-full'>
        {seriesMetadataQuery.isError ? (
          <ErrorState
            retry={() => seriesMetadataQuery.refetch()}
            className='h-full'
            style={{
              width: chartDimensions.width,
              height: chartDimensions.height,
            }}
          />
        ) : seriesMetadataQuery.isLoading || !metadata ? (
          <div
            className='grid place-items-center'
            style={{
              width: chartDimensions.width,
              height: chartDimensions.height,
            }}
          >
            <LoadingIndicator />
          </div>
        ) : (
          <SeriesMetadataProvider metadata={metadata}>
            <ChartContext.Provider value={chartDimensions}>
              <SeriesChart
                code={selectedSeries.code}
                startDate={dateRange?.startDate ?? metadata.minDate}
                endDate={dateRange?.endDate ?? metadata.maxDate}
                regionalDivision={regionalDivision}
                region='brazil'
                className='view-transition-[series-chart]'
              />
            </ChartContext.Provider>
          </SeriesMetadataProvider>
        )}
      </div>
    </div>
  )
}
