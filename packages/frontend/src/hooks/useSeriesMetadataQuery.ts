import { useQuery } from '@tanstack/react-query'
import { getSeriesMetadata } from '../api/ipea/get-series-metadata'
import { formatSeriesMetadata } from '../utils/format-series-metadata'

export function useSeriesMetadataQuery(code: string) {
  return useQuery({
    queryKey: ['seriesMetadata', code],
    queryFn: ({ signal }) =>
      getSeriesMetadata(code, { signal }).then(formatSeriesMetadata),
    enabled: Boolean(code),
  })
}
