import {
  GeographicDivision,
  DivisionToPlotAsMap,
  IbgeMapDivision,
  IbgeLocationDivision,
} from './types'

export const geographicDivisions = [
  'Brasil',
  'Área metropolitana',
  'Regiões',
  'Estados',
  'Mesorregiões',
  'Microrregiões',
  'Municípios',
] as const

// IBGE Maps API documentation:
// https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
const BASE_URL_MAPS = 'https://servicodados.ibge.gov.br/api/v2/malhas/'

const mapDivisionsCode: Record<IbgeMapDivision, number> = {
  Brasil: 0,
  Regiões: 1,
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5,
}

interface getMapUrlOptions {
  id: string
  division?: IbgeMapDivision
  format?: string
}

export function getMapUrl({ id, division, format }: getMapUrlOptions): string {
  const url = new URL(id, BASE_URL_MAPS)

  url.searchParams.set('formato', format || 'application/json')

  if (division) {
    url.searchParams.set('resolucao', String(mapDivisionsCode[division]))
  }

  return url.toString()
}

export function shouldPlotMap(
  division: GeographicDivision
): division is DivisionToPlotAsMap {
  return !(
    division === 'Brasil' ||
    division === 'Regiões' ||
    division === 'Área metropolitana'
  )
}

/**
 * Given a division, get those divisions that contains it.
 * For example, a state is contained inside a region and a country.
 * A containing division has a smaller code than the divisions it contains.
 */
export function getContainingDivisions(
  targetDivision: DivisionToPlotAsMap
): IbgeMapDivision[] {
  const targetDivisionCode = mapDivisionsCode[targetDivision]

  const containingDivisions = Object.entries(mapDivisionsCode)
    .filter(([_, code]) => code < targetDivisionCode)
    .map(([name]) => name as IbgeMapDivision)

  return containingDivisions
}

// IBGE Locations API documentation:
// https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
const BASE_URL_DIVISIONS =
  'https://servicodados.ibge.gov.br/api/v1/localidades/'

const divisionsEndpoints: Record<IbgeLocationDivision, string> = {
  Regiões: 'regioes',
  Estados: 'estados',
  Mesorregiões: 'mesorregioes',
  Microrregiões: 'microrregioes',
  Municípios: 'municipios',
}

export function getDivisionNamesUrl(division: IbgeLocationDivision) {
  return BASE_URL_DIVISIONS + divisionsEndpoints[division]
}
