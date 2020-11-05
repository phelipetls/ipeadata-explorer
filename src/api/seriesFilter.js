import { formatDateFromDatePicker } from "./date-utils";

export const DEFAULT_URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados?" +
  "$count=true&$orderby=SERATUALIZACAO desc";

function getFormElementValue(element) {
  return element.type === "checkbox" ? element.checked : element.value;
}

export function filterSeriesFromForm(formElements) {
  const filledFormElements = Array.from(formElements)
    .filter(element => getFormElementValue(element) && !element.disabled)
    .map(element => [element.name, getFormElementValue(element)]);

  return filledFormElements.length > 0
    ? filterSeries(filledFormElements)
    : DEFAULT_URL;
}

export function filterSeriesFromUrl(searchParams) {
  if (searchParams.toString() !== "") {
    return filterSeries(Array.from(searchParams));
  }
}

function filterSeries(nameValuePairs) {
  const filterQuery = nameValuePairs.map(getFilter).join(" and ");
  return DEFAULT_URL + `&$filter=${filterQuery}` + getHelperQuery(filterQuery);
}

function getFilter([name, value]) {
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
