import {
  formatDateToBackend,
  formatDateToBackendOptions,
} from "./format-date-to-backend";

/**
 * Format a date in the format __/__/____ (which was given as a mask to
 * KeyboardDatePicker component) into an appropriate format for the backend.
 */
export function formatDateFromDatePicker(
  date: string,
  options?: formatDateToBackendOptions
): string {
  const [day, month, year] = date.split("/").map(s => parseInt(s));
  const dateFromString = new Date(year, month - 1, day);
  return formatDateToBackend(dateFromString, options);
}
