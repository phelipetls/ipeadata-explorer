import { useQuery } from '@tanstack/react-query'
import { getRegions } from '../api/ipea/get-regions'

export function useRegionsQuery() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: ({ signal }) => getRegions({ signal }),
    staleTime: Infinity,
  })
}
