import { formatDate } from "./utils";

const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados?$count=true";

export function filterSeriesFromForm(formElements) {
  return filterSeries(
    Array.from(formElements)
      .filter(element => element.value && !element.disabled)
      .map(({ name, type, value, checked }) => [
        name,
        type === "checkbox" ? checked : value,
      ])
  );
}

export function filterSeriesFromUrl(searchParams) {
  if (searchParams.toString() !== "") {
    return filterSeries(Array.from(searchParams));
  }
}

function filterSeries(queries) {
  const filterQuery = queries.map(getFilter).join(" and ");
  return URL + `&$filter=${filterQuery}` + getHelperQuery(filterQuery);
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
      return `SERMINDATA ge ${formatDate(value)}`;
    case "SERMAXDATA":
      return `SERMAXDATA le ${formatDate(value)}`;
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