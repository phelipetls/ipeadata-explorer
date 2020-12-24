import { BASE_URL } from "../odata";
import { formatDateFromDatePicker } from "../date-utils";
import isEmpty from "lodash/isEmpty";

const ORDER_BY_UPDATED_DATE_DESCENDING = "$orderby=SERATUALIZACAO desc";
const INCLUDE_COUNT = "$count=true";

export const DEFAULT_SEARCH_QUERY =
  BASE_URL + `/Metadados?${INCLUDE_COUNT}&${ORDER_BY_UPDATED_DATE_DESCENDING}`;

export function getSearchQueryFromForm(inputs: Record<string, string>): string {
  if (isEmpty(inputs)) {
    return DEFAULT_SEARCH_QUERY;
  }

  return getSearchQuery(Object.entries(inputs));
}

export function getSearchQueryFromUrl(searchParams: URLSearchParams): string {
  if (searchParams.toString() === "") {
    return "";
  }

  return getSearchQuery(Array.from(searchParams));
}

function getSearchQuery(queries: [string, string][]) {
  const filterQuery = queries.map(query => getFilter(query)).join(" and ");

  return (
    DEFAULT_SEARCH_QUERY +
    `&$filter=${filterQuery}` +
    getHelperQuery(filterQuery)
  );
}

function getFilter([name, value]: [string, string]) {
  switch (name) {
    case "SERNOME":
    case "UNINOME":
    case "PERNOME":
    case "TEMNOME":
      return `contains(${name},'${value}')`;
    case "FNTNOME":
      return (
        `(contains(FNTNOME,'${value}') or` +
        ` contains(FNTSIGLA,'${value}') or` +
        ` contains(FNTURL,'${value}'))`
      );
    // FIXME: PAINOME is not in SeriesMetadata, use PAICODIGO instead
    case "PAINOME":
      return (
        `(contains(Pais/PAINOME,'${value}') or` +
        ` contains(PAICODIGO,'${value}'))`
      );
    case "SERMINDATA":
      return `SERMINDATA ge ${formatDateFromDatePicker(value as string)}`;
    case "SERMAXDATA":
      return `SERMAXDATA le ${formatDateFromDatePicker(value as string)}`;
    case "BASNOME":
      return (
        "(" +
        value
          .split(",")
          .map(base => `BASNOME eq '${base}'`)
          .join(" or ") +
        ")"
      );
    case "PAICODIGO":
    case "SERSTATUS":
      return `${name} eq '${value}'`;
    case "SERNUMERICA":
    case "TEMCODIGO":
      return `${name} eq ${value}`;
    case "SERTEMAMC":
    case "SERTEMBR":
    case "SERTEMEST":
    case "SERTEMMUN":
    case "SERTEMMET":
      return `${name} eq ${Number(value)}`;
    default:
      throw new Error();
  }
}

function getHelperQuery(filter: string) {
  return filter.includes("Pais/PAINOME") ? "&$expand=Pais" : "";
}
