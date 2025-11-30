import { differenceInMilliseconds } from 'date-fns'

export function findClosestDate(dates: Date[], targetDate: Date): Date | null {
  if (dates.length === 0) {
    return null
  }

  let closestDate = dates[0]
  let minDifference = closestDate
    ? Math.abs(differenceInMilliseconds(closestDate, targetDate))
    : Infinity

  for (const date of dates) {
    const difference = Math.abs(differenceInMilliseconds(date, targetDate))

    if (difference < minDifference) {
      minDifference = difference
      closestDate = date
    }
  }

  return closestDate ?? null
}
