import { useQuery } from '@tanstack/react-query'
import { getRegions } from '../api/ipea/get-regions'
import territories from '../assets/territories.json' with { type: 'json' }

export function useRegionsQuery() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: ({ signal }) => getRegions({ signal }),
    staleTime: Infinity,
    placeholderData: Object.fromEntries(territories as Array<[string, string]>),
  })
}
