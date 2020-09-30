import { formatDate } from "./utils";

export function buildMetadataUrl(code) {
  return `http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('${code}')`;
}

export function buildSeriesUrl(code) {
  return (
    buildMetadataUrl(code) +
    "/Valores?$select=VALDATA,VALVALOR,TERCODIGO,TERNOME&$orderby=VALDATA desc"
  );
}

export function buildCategoricalSeriesUrl(code) {
  return (
    buildMetadataUrl(code) +
    "/ValoresStr?$select=VALDATA,VALVALOR,TERCODIGO&$orderby=VALDATA desc"
  );
}

export function limitQuery(url, limit) {
  return url + `&$top=${limit}`;
}

export function offsetQuery(url, offset) {
  return url + `&$skip=${offset}`;
}

export function limitByDate(url, initialDate, finalDate) {
  const filters = [];
  if (initialDate) filters.push(`VALDATA ge ${formatDate(initialDate)}`);
  if (finalDate) filters.push(`VALDATA le ${formatDate(finalDate)}`);
  const joinedFilters = filters.join(" and ");

  if (url.includes("filter")) {
    return url.replace(/filter=(.*?)(?=&|$)/, `$& and ${joinedFilters}`);
  }

  return url + `&$filter=${joinedFilters}`;
}

export async function fetchGeographicDivisions(code) {
  const url =
    buildMetadataUrl(code) +
    "/Valores?" +
    "$apply=filter(not startswith(NIVNOME,'AMC'))" +
    "/groupby((NIVNOME),aggregate(TERNOME with countdistinct as regionCount))" +
    "&$orderby=regionCount asc";
  const response = await fetch(url);
  const json = await response.json();
  return json.value;
}
