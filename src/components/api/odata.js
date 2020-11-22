import { formatDateFromDatePicker, getLastNDates } from "./date-utils";

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

export function limitQuery(limit) {
  return `&$top=${limit}`;
}

export function offsetQuery(offset) {
  return `&$skip=${offset}`;
}

export function limitByDate(initialDate, finalDate) {
  const filters = [];
  if (initialDate) filters.push(`VALDATA ge ${initialDate}`);
  if (finalDate) filters.push(`VALDATA le ${finalDate}`);
  return filters.join(" and ");
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
