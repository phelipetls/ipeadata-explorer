import { parseAsInteger, useQueryState } from 'nuqs'

export function useSelectedRegion() {
  return useQueryState('region', parseAsInteger.withDefault(0))
}
