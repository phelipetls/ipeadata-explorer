export function getDateDomain(dates: Date[]): [number, number] {
  const timestamps = dates.map((date) => date.getTime())
  return [Math.min(...timestamps), Math.max(...timestamps)]
}

export function getValueDomain(
  values: number[],
  startsAtZero: boolean,
): [number, number] {
  const minValue = startsAtZero ? 0 : Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue
  const padding = range * 0.1
  return [minValue - padding, maxValue + padding]
}
