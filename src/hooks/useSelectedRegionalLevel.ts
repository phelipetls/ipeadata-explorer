import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { REGIONAL_LEVELS } from '../consts'
import type { RegionalLevel } from '../types'

export function useSelectedRegionalDivision(defaultValue: RegionalLevel) {
  return useQueryState(
    'regionalDivision',
    parseAsStringLiteral(REGIONAL_LEVELS).withDefault(defaultValue),
  )
}
