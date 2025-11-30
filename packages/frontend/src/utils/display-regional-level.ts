import type { RegionalLevel } from '../types'

const pluralLevelNames: Record<RegionalLevel, string> = {
  brazil: 'Brasil',
  regions: 'Regiões',
  states: 'Estados',
  municipalities: 'Municípios',
}

const singularLevelNames: Record<RegionalLevel, string> = {
  brazil: 'Brasil',
  regions: 'Região',
  states: 'Estado',
  municipalities: 'Município',
}

export function displayRegionalLevel(
  level: RegionalLevel,
  options?: { plural?: boolean },
): string {
  const plural = options?.plural ?? true
  return plural ? pluralLevelNames[level] : singularLevelNames[level]
}
