import { ChoroplethMap } from './ChoroplethMap'
import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import type { IbgeGeoJson } from '../types'
import { NEGATIVE_SERIES, DIVERGENT_SERIES } from '../consts'
import * as d3 from 'd3'

type Props = {
  code: string
  title?: string
  geojson: IbgeGeoJson
  data: {
    date: Date
    value: number | null
    region?: { name: string; code: number }
  }[]
  selectedRegionCode: string
}

export function SeriesChoroplethMapView({
  code,
  title,
  data,
  geojson,
  selectedRegionCode,
}: Props) {
  const metadata = useSeriesMetadataContext()

  const tooltipValueFormatter = (value: number) => {
    const numFormatter = new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    })
    const formatted = numFormatter.format(value)
    return metadata.unit ? `${formatted} - ${metadata.unit}` : formatted
  }

  const legendLabel = metadata.unit || metadata.name

  const isDivergent = DIVERGENT_SERIES.has(code)
  const isNegative = NEGATIVE_SERIES.has(code)

  let colorScheme: readonly string[]
  if (isDivergent) {
    colorScheme = d3.schemeRdYlBu[5]?.slice() ?? []
    if (isNegative) {
      colorScheme = [...colorScheme].reverse()
    }
  } else {
    if (isNegative) {
      colorScheme = d3.schemeOrRd[5]?.slice() ?? []
    } else {
      colorScheme = d3.schemeGnBu[5]?.slice() ?? []
    }
  }

  return (
    <ChoroplethMap
      title={title}
      tooltipValueFormatter={tooltipValueFormatter}
      legendLabel={legendLabel}
      data={data}
      geojson={geojson}
      selectedRegionCode={selectedRegionCode}
      colorScheme={colorScheme}
    />
  )
}
