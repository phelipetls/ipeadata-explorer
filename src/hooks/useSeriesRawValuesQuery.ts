import { useQuery } from '@tanstack/react-query'
import { getSeriesValues } from '../api/ipea/get-series-values'

export function useSeriesRawValuesQuery(code: string) {
  return useQuery({
    queryKey: ['seriesRawValues', code],
    queryFn: ({ signal }) => getSeriesValues(code, { signal }),
    enabled: Boolean(code),
  })
}
