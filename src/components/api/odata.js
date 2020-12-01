import { formatDateFromDatePicker, getLastNDates } from "./date-utils";

export const BASE_URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/";
const ORDER_BY_DATE_DESCENCING = "$orderby=VALDATA desc";
const DEFAULT_FIELDS_TO_SELECT = "$select=VALDATA,VALVALOR,TERCODIGO,TERNOME";

export function buildMetadataUrl(code) {
  return BASE_URL + `Metadados('${code}')`;
}

export function buildSeriesUrl(code) {
  return (
    buildMetadataUrl(code) +
    `/Valores?${DEFAULT_FIELDS_TO_SELECT}&${ORDER_BY_DATE_DESCENCING}`
  );
}

const COUNT_BY_CATEGORY = "groupby((VALVALOR),aggregate($count as count))";
const ORDER_BY_COUNT_DESCENDING = "$orderby=count desc";

export function buildCountByCategoryUrl(code, { filter }) {
  const applyQuery = `$apply=filter(${filter})/${COUNT_BY_CATEGORY}`;

  return (
    buildMetadataUrl(code) +
    `/ValoresStr?${applyQuery}&${ORDER_BY_COUNT_DESCENDING}`
  );
}

/* Join OData logical expressions with an 'and' operator
 *
 * @param {...string} Strings to be used as filters.
 * @returns {string} A valid OData filter expression.
 *
 * @example
 * // returns "NIVNOME eq 'Brasil' and VALVALOR > 15"
 * joinFilters("NIVNOME eq 'Brasil'", "VALVALOR > 15")
 *
 * @example
 * // returns "VALDATA eq '2015-01-01T00:00:00-03:00"
 * joinFilters(undefined, "VALDATA eq '2015-01-01T00:00:00-03:00"")
 */
export function joinFilters(...filters) {
  return filters.filter(value => Boolean(value)).join(" and ");
}

export function buildFilter(...filters) {
  return `&$filter=${joinFilters(...filters)}`;
}

export function limitQuery(limit) {
  return `&$top=${limit}`;
}

export function offsetQuery(offset) {
  return `&$skip=${offset}`;
}

export function limitByDate(initialDate, finalDate) {
  const startInterval = initialDate ? `VALDATA ge ${initialDate}` : "";
  const endInterval = finalDate ? `VALDATA le ${finalDate}` : "";
  return joinFilters(startInterval, endInterval);
}

export function getDateFilter(initialDate, finalDate, lastN, metadata) {
  if (initialDate || finalDate) {
    return limitByDate(
      formatDateFromDatePicker(initialDate),
      formatDateFromDatePicker(finalDate, { isEndDate: true })
    );
  }

  return limitByDate(
    getLastNDates({
      metadata: metadata,
      offset: lastN,
    })
  );
}

// AMCs are not real delimited geographic divisions
const EXCLUDE_AMC_REGIONS = "filter(not startswith(NIVNOME,'AMC'))";
const COUNT_BY_DIVISION = "groupby((NIVNOME),aggregate($count as count))";
// Divisions with less values first to get the least complex division (usually
// no division, e.g., the whole Brazil, or as few as possible, e.g., Regions,
// States)
const ORDER_BY_COUNT_ASCENDING = "$orderby=count asc";

export function buildGeographicDivisionsUrl(code) {
  return (
    buildMetadataUrl(code) +
    "/Valores?" +
    `$apply=${EXCLUDE_AMC_REGIONS}` +
    `/${COUNT_BY_DIVISION}` +
    `&${ORDER_BY_COUNT_ASCENDING}`
  );
}
