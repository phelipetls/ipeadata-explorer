import { BASE_URL } from "../odata";
import { formatDateFromDatePicker } from "../date-utils";

const ORDER_BY_UPDATED_DATE_DESCENDING = "$orderby=SERATUALIZACAO desc";
const INCLUDE_COUNT = "$count=true";

export const DEFAULT_URL =
  BASE_URL + `/Metadados?${INCLUDE_COUNT}&${ORDER_BY_UPDATED_DATE_DESCENDING}`;

function getFormElementValue(element) {
  return element.type === "checkbox" ? element.checked : element.value;
}

function getNonEmptyFormElements(elements) {
  return elements.filter(
    element => Boolean(getFormElementValue(element)) && !element.disabled
  );
}

export function searchSeriesFromForm(formElements) {
  const nonEmptyFormElements = getNonEmptyFormElements(
    Array.from(formElements)
  ).map(element => [element.name, getFormElementValue(element)]);

  return nonEmptyFormElements.length > 0
    ? searchSeries(nonEmptyFormElements)
    : DEFAULT_URL;
}

export function searchSeriesFromUrl(searchParams) {
  if (searchParams.toString() !== "") {
    return searchSeries(Array.from(searchParams));
  }
}

function searchSeries(nameValuePairs) {
  const filterQuery = nameValuePairs.map(getSearchQuery).join(" and ");
  return DEFAULT_URL + `&$filter=${filterQuery}` + getHelperQuery(filterQuery);
}

function getSearchQuery([name, value]) {
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
    case "PAINOME":
      return (
        `(contains(Pais/PAINOME,'${value}') or` +
        ` contains(PAICODIGO,'${value}'))`
      );
    case "SERMINDATA":
      return `SERMINDATA ge ${formatDateFromDatePicker(value)}`;
    case "SERMAXDATA":
      return `SERMAXDATA le ${formatDateFromDatePicker(value)}`;
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
      throw new Error("Este parâmetro não é suportado para filtragem.");
  }
}

function getHelperQuery(filter) {
  return filter.includes("Pais/PAINOME") ? "&$expand=Pais" : "";
}
