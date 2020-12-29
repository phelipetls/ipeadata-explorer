import { SeriesMetadata } from "types";
import { formatDateToBackend, offsetDate } from "api/odata";

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
  start: Date | null;
  end: Date | null;
  lastN: number;
  metadata: SeriesMetadata;
}

export function getDateFilter({ start, end, lastN, metadata }: dateFilters) {
  if (start && end) {
    return limitByDate({
      start: formatDateToBackend(start),
      end: formatDateToBackend(end, { isEndDate: true }),
    });
  }

  if (start) {
    return limitByDate({ start: formatDateToBackend(start) });
  }

  if (end) {
    return limitByDate({ end: formatDateToBackend(end, { isEndDate: true }) });
  }

  return limitByDate({
    start: offsetDate({
      date: new Date(metadata.SERMAXDATA || Date.now()),
      period: metadata.PERNOME,
      offset: lastN - 1,
    }),
  });
}
