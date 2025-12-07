import { TimeSeriesLineChart } from './TimeSeriesLineChart'
import * as d3 from 'd3'
import locale_ptBR from 'd3-time-format/locale/pt-BR' with { type: 'json' }
import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import { groupBy } from '../utils/group-by'
import { MultiTimeSeriesLineChart } from './MultiTimeSeriesLineChart'
import { displayCountry } from '../utils/display-country'

// @ts-expect-error it works
d3.timeFormatDefaultLocale(locale_ptBR)

interface SeriesLineChartViewProps {
  data: {
    date: Date
    value: number | null
    region?: { name: string; code: number }
  }[]
  title?: string
}

export function SeriesLineChartView({ data, title }: SeriesLineChartViewProps) {
  const metadata = useSeriesMetadataContext()

  const isPercentage = metadata.unit ? metadata.unit.includes('%') : false

  const tooltipDateFormatter = d3.timeFormat('%d/%m/%Y')

  const yAxisTickFormatter = isPercentage
    ? (d: number) => d3.format('.0f')(d) + '%'
    : d3.format('.2s')

  const yAxisStartsAtZero = isPercentage

  const yAxisLabel = metadata.unit

  const regions = new Set(
    data.flatMap((d) => (d.region ? [d.region?.name] : [])),
  )
  if (regions.size > 1) {
    const groupedByData = groupBy(
      data,
      (item) => item.region?.name ?? 'default',
    )

    return (
      <MultiTimeSeriesLineChart
        title={title}
        data={groupedByData}
        tooltipDateFormatter={tooltipDateFormatter}
        yAxisTickFormatter={yAxisTickFormatter}
        yAxisStartsAtZero={yAxisStartsAtZero}
        yAxisLabel={yAxisLabel}
      />
    )
  }

  return (
    <TimeSeriesLineChart
      title={title}
      data={data}
      tooltipDateFormatter={tooltipDateFormatter}
      yAxisTickFormatter={yAxisTickFormatter}
      yAxisStartsAtZero={yAxisStartsAtZero}
      yAxisLabel={yAxisLabel}
      legend={[
        {
          color: 'var(--color-chart-data-line)',
          label: displayCountry(metadata.countryCode),
        },
      ]}
    />
  )
}
