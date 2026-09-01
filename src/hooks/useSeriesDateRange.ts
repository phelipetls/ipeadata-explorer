import { useMemo } from 'react'
import { useSeriesRawValuesQuery } from './useSeriesRawValuesQuery'
import {
  getSeriesMinDate,
  getSeriesMaxDate,
} from '../utils/series-metadata-helpers'

export function useSeriesDateRange(code: string) {
  const valuesQuery = useSeriesRawValuesQuery(code)

  const dateRange = useMemo(() => {
    if (!valuesQuery.data) return { minDate: new Date(), maxDate: new Date() }
    return {
      minDate: getSeriesMinDate(valuesQuery.data),
      maxDate: getSeriesMaxDate(valuesQuery.data),
    }
  }, [valuesQuery.data])

  return {
    ...dateRange,
    isLoading: valuesQuery.isLoading,
    error: valuesQuery.error,
  }
}
