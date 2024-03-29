import { BASE_URL, formatDateToBackend } from 'api/ipea'
import isEmpty from 'lodash/isEmpty'

const ORDER_BY_UPDATED_DATE_DESCENDING = '$orderby=SERATUALIZACAO desc'
const INCLUDE_COUNT = '$count=true'

export const DEFAULT_SEARCH_QUERY =
  BASE_URL + `Metadados?${INCLUDE_COUNT}&${ORDER_BY_UPDATED_DATE_DESCENDING}`

const ipeaFields = [
  'SERNOME',
  'UNINOME',
  'PERNOME',
  'TEMNOME',
  'FNTNOME',
  'PAICODIGO',
  'SERMINDATA',
  'SERMAXDATA',
  'BASNOME',
  'SERSTATUS',
  'SERNUMERICA',
  'TEMCODIGO',
  'SERTEMAMC',
  'SERTEMBR',
  'SERTEMEST',
  'SERTEMMUN',
  'SERTEMMET',
]

export function getSearchValuesFromUrl(searchParams: URLSearchParams) {
  const searchValuesEntries = Array.from(searchParams.entries()).filter(
    ([key]) => ipeaFields.includes(key)
  )

  return Object.fromEntries(searchValuesEntries)
}

export function buildSearchUrl(searchValues: Record<string, string>) {
  if (isEmpty(searchValues)) {
    return DEFAULT_SEARCH_QUERY
  }

  return buildSearchQuery(Object.entries(searchValues))
}

function buildSearchQuery(queries: [string, any][]) {
  const filterQuery = queries.map((query) => getFilter(query)).join(' and ')

  return (
    DEFAULT_SEARCH_QUERY +
    `&$filter=${filterQuery}` +
    getHelperQuery(filterQuery)
  )
}

function getFilter([name, value]: [string, any]) {
  switch (name) {
    case 'SERNOME':
    case 'UNINOME':
    case 'PERNOME':
    case 'TEMNOME':
      return `contains(${name},'${value}')`
    case 'FNTNOME':
      return (
        `(contains(FNTNOME,'${value}') or` +
        ` contains(FNTSIGLA,'${value}') or` +
        ` contains(FNTURL,'${value}'))`
      )
    case 'PAICODIGO':
      return (
        `(contains(Pais/PAINOME,'${value}') or` +
        ` contains(PAICODIGO,'${value}'))`
      )
    case 'SERMINDATA':
      return `SERMINDATA ge ${formatDateToBackend(value as Date)}`
    case 'SERMAXDATA':
      return `SERMAXDATA le ${formatDateToBackend(value as Date)}`
    case 'BASNOME':
      return `(${value
        .map((base: string) => `BASNOME eq '${base}'`)
        .join(' or ')})`
    case 'SERSTATUS':
      return `${name} eq '${value}'`
    case 'SERNUMERICA':
    case 'TEMCODIGO':
      return `${name} eq ${value}`
    case 'SERTEMAMC':
    case 'SERTEMBR':
    case 'SERTEMEST':
    case 'SERTEMMUN':
    case 'SERTEMMET':
      return `${name} eq ${Number(value)}`
    default:
      throw new Error()
  }
}

function getHelperQuery(filter: string) {
  return filter.includes('Pais/PAINOME') ? '&$expand=Pais' : ''
}
