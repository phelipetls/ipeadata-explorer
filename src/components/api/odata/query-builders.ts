import { SeriesMetadata } from "../../types/series-metadata";
import { formatDateFromDatePicker, offsetDate } from "../date-utils";

export function joinFilters(...filters: Array<string | null>) {
  return filters.filter(value => Boolean(value)).join(" and ");
}

export function buildFilter(...filters: Array<string | null>) {
  return `&$filter=${joinFilters(...filters)}`;
}

export function limitQuery(limit: number) {
  return `&$top=${limit}`;
}

export function offsetQuery(offset: number) {
  return `&$skip=${offset}`;
}

export function limitByDate(initialDate: string, finalDate?: string) {
  const startInterval = initialDate ? `VALDATA ge ${initialDate}` : "";
  const endInterval = finalDate ? `VALDATA le ${finalDate}` : "";
  return joinFilters(startInterval, endInterval);
}

export function getDateFilter(
  initialDate: string | null,
  finalDate: string | null,
  lastN: number,
  metadata: SeriesMetadata
) {
  if (initialDate && finalDate) {
    return limitByDate(
      formatDateFromDatePicker(initialDate),
      formatDateFromDatePicker(finalDate, { isEndDate: true })
    );
  }

  if (initialDate) {
    return limitByDate(formatDateFromDatePicker(initialDate));
  } else if (finalDate) {
    return limitByDate(formatDateFromDatePicker(finalDate));
  }

  return limitByDate(
    offsetDate({
      date: new Date(metadata.SERMAXDATA),
      period: metadata.PERNOME,
      offset: lastN,
    })
  );
}
