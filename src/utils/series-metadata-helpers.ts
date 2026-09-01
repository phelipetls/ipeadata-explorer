import type { RawSeriesValue } from '../api/ipea/get-series-values'
import type { RegionalLevel } from '../types'
import { parseDate } from './parse-date'
import { getIpeaRegionalLevel } from './get-ipea-regional-level'
import { compareAsc } from 'date-fns'

export function getSeriesMinDate(rawValues: RawSeriesValue[]): Date {
  const timestamps = rawValues
    .map((item) => parseDate(item.VALDATA)?.getTime())
    .filter((t): t is number => t != null)
  return new Date(timestamps.length > 0 ? Math.min(...timestamps) : Date.now())
}

export function getSeriesMaxDate(rawValues: RawSeriesValue[]): Date {
  const timestamps = rawValues
    .map((item) => parseDate(item.VALDATA)?.getTime())
    .filter((t): t is number => t != null)
  return new Date(timestamps.length > 0 ? Math.max(...timestamps) : Date.now())
}

export function getSeriesRegionalLevels(
  rawValues: RawSeriesValue[],
): RegionalLevel[] {
  const set = new Set<RegionalLevel>(
    rawValues.map((item) => getIpeaRegionalLevel(item.NIVNOME)),
  )
  if (set.size === 0) set.add('brazil')
  return Array.from(set)
}

export function getSeriesPossibleDates(rawValues: RawSeriesValue[]): Date[] {
  const dateMap = new Map<number, Date>()
  for (const item of rawValues) {
    const date = parseDate(item.VALDATA)
    if (date && !dateMap.has(date.getTime())) {
      dateMap.set(date.getTime(), date)
    }
  }
  return Array.from(dateMap.values()).sort(compareAsc)
}
