import { useQuery } from '@tanstack/react-query'
import { useDeferredValue } from 'react'
import { getBrazilMap } from '../api/ibge/get-brazil-map'
import { getSeriesValues } from '../api/ipea/get-series-values'
import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import type { IbgeGeoJson, RegionalLevel } from '../types'
import { getChartType } from '../utils/get-chart-type'
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorState } from './ErrorState'
import { SeriesChoroplethMapView } from './SeriesChoroplethMapView'
import clsx from 'clsx'
import { SeriesLineChartView } from './SeriesLineChartView'
import { useChartContext } from '../context/ChartContext'

const EMPTY_GEO_JSON: IbgeGeoJson = {
  type: 'FeatureCollection',
  features: [],
}

type Props = {
  code: string
  startDate: Date
  endDate: Date
  regionalDivision: RegionalLevel
  region: string
  title?: string
  className?: string
}

export function SeriesChart({
  code,
  region,
  regionalDivision,
  startDate,
  endDate,
  title,
  className,
}: Props) {
  const chartContext = useChartContext()
  const metadata = useSeriesMetadataContext()

  const chartType = getChartType({
    database: metadata.database,
    regionalDivision: regionalDivision,
  })

  const dataQuery = useQuery({
    queryKey: [
      'seriesData',
      code,
      regionalDivision,
      startDate.getTime(),
      endDate.getTime(),
      'chart',
    ],
    queryFn: ({ signal }) =>
      getSeriesValues(code, {
        signal,
        regionalLevel:
          metadata.database === 'macroeconomic' ? undefined : regionalDivision,
        startDate,
        endDate,
      }),
    enabled: code !== '',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const data = dataQuery.data ?? []

  const brazilMapQuery = useQuery({
    queryKey: ['brazilMap', regionalDivision],
    queryFn: ({ signal }) =>
      getBrazilMap({
        intraRegion: regionalDivision as 'municipalities' | 'states',
        signal,
      }),
    enabled:
      regionalDivision === 'municipalities' || regionalDivision === 'states',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const geojson = brazilMapQuery.data ?? EMPTY_GEO_JSON
  const deferredGeoJson = useDeferredValue(geojson, EMPTY_GEO_JSON)

  const isLoading = dataQuery.isLoading || brazilMapQuery.isLoading

  const loadingSpinner = (
    <div
      style={{ width: chartContext.width, height: chartContext.height }}
      className={clsx('grid place-items-center', className)}
    >
      <LoadingIndicator />
    </div>
  )

  if (chartType === 'line') {
    if (isLoading) {
      return loadingSpinner
    }

    return (
      <div className={className}>
        <SeriesLineChartView data={data} title={title} />
      </div>
    )
  }

  const isError = dataQuery.isError || brazilMapQuery.isError

  if (isError) {
    return (
      <ErrorState
        retry={() => {
          if (dataQuery.isError) dataQuery.refetch()
          if (brazilMapQuery.isError) brazilMapQuery.refetch()
        }}
        className={clsx('h-full', className)}
        style={{ width: chartContext.width, height: chartContext.height }}
      />
    )
  }

  if (isLoading) {
    return loadingSpinner
  }

  return (
    <div
      className={clsx(geojson !== deferredGeoJson && 'opacity-75', className)}
    >
      <SeriesChoroplethMapView
        code={code}
        title={title}
        data={data}
        geojson={deferredGeoJson}
        selectedRegionCode={region}
      />
    </div>
  )
}
