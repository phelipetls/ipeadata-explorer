import { useQuery } from '@tanstack/react-query'
import { getThemes } from '../api/ipea/get-themes'

export function useThemesQuery() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: ({ signal }) => getThemes({ signal }),
    staleTime: Infinity,
  })
}
