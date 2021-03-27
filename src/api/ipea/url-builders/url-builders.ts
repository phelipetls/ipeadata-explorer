export const BASE_URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/";

export function buildMetadataUrl(code: string) {
  return BASE_URL + `Metadados('${code}')`;
}

const ORDER_BY_DATE_DESCENCING = "$orderby=VALDATA desc";
const DEFAULT_FIELDS_TO_SELECT = "$select=VALDATA,VALVALOR,TERCODIGO,TERNOME";

export function buildSeriesValuesUrl(code: string) {
  return (
    buildMetadataUrl(code) +
    `/Valores?${DEFAULT_FIELDS_TO_SELECT}&${ORDER_BY_DATE_DESCENCING}`
  );
}

const COUNT_BY_CATEGORY = "groupby((VALVALOR),aggregate($count as count))";
const ORDER_BY_COUNT_DESCENDING = "$orderby=count desc";

export interface CategoriesMetadata {
  VALVALOR: string;
  count: number;
}

export function buildCountByCategoryUrl(
  code: string,
  { filter }: { filter: string }
) {
  const applyQuery = `$apply=filter(${filter})/${COUNT_BY_CATEGORY}`;

  return (
    buildMetadataUrl(code) +
    `/ValoresStr?${applyQuery}&${ORDER_BY_COUNT_DESCENDING}`
  );
}

// AMCs are not real delimited geographic divisions
const EXCLUDE_AMC_REGIONS = "filter(not startswith(NIVNOME,'AMC'))";
const COUNT_BY_DIVISION = "groupby((NIVNOME),aggregate($count as count))";
// Divisions with less values first to get the least complex division (usually
// no division, e.g., the whole Brazil, or as few as possible, e.g., Regions,
// States)
const ORDER_BY_COUNT_ASCENDING = "$orderby=count asc";

export function buildGeographicDivisionsUrl(code: string) {
  return (
    buildMetadataUrl(code) +
    "/Valores?" +
    `$apply=${EXCLUDE_AMC_REGIONS}` +
    `/${COUNT_BY_DIVISION}` +
    `&${ORDER_BY_COUNT_ASCENDING}`
  );
}
