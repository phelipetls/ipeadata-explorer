import * as d3 from 'd3'
import { getDateDomain, getValueDomain } from './d3-domains'

export function getTimeSeriesScales(
  data: { date: Date; value: number | null }[],
  dimensions: {
    width: number
    height: number
    marginTop: number
    marginRight: number
    marginLeft: number
    marginBottom: number
  },
  options: { yAxisStartsAtZero: boolean },
) {
  const dates = data.map((item) => item.date)
  const values = data.flatMap((item) => (item.value ? [item.value] : []))
  const [minDate, maxDate] = getDateDomain(dates)
  const [minValue, maxValue] = getValueDomain(values, options.yAxisStartsAtZero)

  const x = d3
    .scaleTime()
    .domain([new Date(minDate), new Date(maxDate)])
    .range([dimensions.marginLeft, dimensions.width - dimensions.marginRight])

  const y = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .nice()
    .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop])

  return [x, y] as const
}
