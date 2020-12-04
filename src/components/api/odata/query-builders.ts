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

interface dateLimits {
  start?: string;
  end?: string;
}

export function limitByDate({ start, end }: dateLimits) {
  const intervalStart = start ? `VALDATA ge ${start}` : "";
  const intervalEnd = end ? `VALDATA le ${end}` : "";
  return joinFilters(intervalStart, intervalEnd);
}

interface dateFilters {
  start: string | null;
  end: string | null;
  lastN: number;
  metadata: SeriesMetadata;
}

export function getDateFilter({ start, end, lastN, metadata }: dateFilters) {
  if (start && end) {
    return limitByDate({
      start: formatDateFromDatePicker(start),
      end: formatDateFromDatePicker(end),
    });
  }

  if (start) {
    return limitByDate({ start: formatDateFromDatePicker(start) });
  }

  if (end) {
    return limitByDate({ end: formatDateFromDatePicker(end) });
  }

  return limitByDate({
    start: offsetDate({
      date: new Date(metadata.SERMAXDATA),
      period: metadata.PERNOME,
      offset: lastN,
    }),
  });
}
