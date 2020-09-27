import { formatISO } from "date-fns";

export function formatDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day);
  return formatISO(date, { representation: "complete" });
}
