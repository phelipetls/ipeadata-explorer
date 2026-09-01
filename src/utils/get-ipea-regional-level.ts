import type { RegionalLevel } from '../types'

/**
 * Maps a raw OData NIVNOME string to our internal RegionalLevel type.
 * Empty string or 'Brasil' both represent the national level.
 */
export function getIpeaRegionalLevel(
  nivnome: string | null | undefined,
): RegionalLevel {
  switch (nivnome) {
    case 'Regiões':
      return 'regions'
    case 'Estados':
      return 'states'
    case 'Municípios':
      return 'municipalities'
    default:
      return 'brazil'
  }
}
