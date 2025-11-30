import * as d3 from 'd3'

const gapBetweenTicks = 80

export function createDateTicks(
  scale: d3.ScaleTime<number, number>,
  dates: Date[],
  chartWidth: number,
): Date[] {
  const maxTicks = Math.floor(chartWidth / gapBetweenTicks)
  if (dates.length <= maxTicks) {
    return dates
  } else {
    return scale.ticks(maxTicks)
  }
}
