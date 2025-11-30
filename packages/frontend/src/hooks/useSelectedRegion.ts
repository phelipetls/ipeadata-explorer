import { parseAsString, useQueryState } from 'nuqs'

export function useSelectedRegion() {
  return useQueryState('region', parseAsString.withDefault('brazil'))
}
