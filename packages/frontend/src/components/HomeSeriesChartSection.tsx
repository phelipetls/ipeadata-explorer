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
import { getCssVariable } from '../utils/get-css-variable'

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
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const metadata = seriesMetadataQuery.data
  const regionalDivision = selectedSeries.regionalDivision

  const dateRange =
    metadata && selectedSeries.getDateRange
      ? selectedSeries.getDateRange(metadata.maxDate)
      : null

  const chartBackgroundColor = getCssVariable('--color-surface-tertiary')

  const chartContext = {
    width,
    backgroundColor: chartBackgroundColor,
    ...dimensions,
  }

  return (
    <div
      style={{ backgroundColor: chartBackgroundColor }}
      className={clsx('p-6 rounded-xl', className)}
    >
      <div ref={containerRef} className='w-full'>
        {seriesMetadataQuery.isError ? (
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
              retry={() => seriesMetadataQuery.refetch()}
            />
          </div>
        ) : seriesMetadataQuery.isLoading || !metadata ? (
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
