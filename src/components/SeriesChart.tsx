import { useDeferredValue } from 'react'
import { getBrazilMap } from '../api/ibge/get-brazil-map'
import { useSeriesValues } from '../hooks/useSeriesValues'
import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import type { IbgeGeoJson, RegionalLevel } from '../types'
import { getChartType } from '../utils/get-chart-type'
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorState } from './ErrorState'
import { SeriesChoroplethMapView } from './SeriesChoroplethMapView'
import clsx from 'clsx'
import { SeriesLineChartView } from './SeriesLineChartView'
import { useChartContext } from '../context/ChartContext'
import { useQuery } from '@tanstack/react-query'

const EMPTY_GEO_JSON: IbgeGeoJson = {
  type: 'FeatureCollection',
  features: [],
}

type Props = {
  code: string
  startDate: Date
  endDate: Date
  regionalDivision: RegionalLevel
  regionCode: number
  title?: string
  className?: string
}

export function SeriesChart({
  code,
  regionCode,
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

  const dataQuery = useSeriesValues(code, {
    regionalLevel:
      metadata.database === 'macroeconomic' ? undefined : regionalDivision,
    startDate,
    endDate,
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

  const isError = Boolean(dataQuery.error) || brazilMapQuery.isError

  if (isError) {
    const description =
      dataQuery.error && brazilMapQuery.isError
        ? 'Não foi possível obter o mapa e os valores da série'
        : dataQuery.error
          ? 'Não foi possível obter os valores da série'
          : brazilMapQuery.isError
            ? 'Não foi possível obter o mapa da série'
            : 'Não foi possível obter os dados'

    return (
      <div className='w-full my-8'>
        <ErrorState
          isCentered
          title='Ocorreu um erro'
          description={`${description}. Por favor, tente novamente mais tarde.`}
          retry={() => {
            if (dataQuery.error) dataQuery.refetch()
            if (brazilMapQuery.isError) brazilMapQuery.refetch()
          }}
        />
      </div>
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
        regionCode={regionCode}
      />
    </div>
  )
}
