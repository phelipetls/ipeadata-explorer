import { sub, subQuarters, startOfQuarter } from "date-fns";

function formatISO(date) {
  return date.toISOString().slice(0, 10) + "T00:00:00Z";
}

export function formatDateFromDatePicker(dateStr) {
  if (!dateStr) return;
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day);
  return formatISO(date);
}

export function subtractSeriesMaxDate({ metadata, offset }) {
  return subtractDateByPeriod({
    isoDateStr: metadata.SERMAXDATA,
    period: metadata.PERNOME,
    offset: offset,
  });
}

const periodicities = {
  Diária: { periodName: "days", periodAmount: 1 },
  Mensal: { periodName: "months", periodAmount: 1 },
  Anual: { periodName: "years", periodAmount: 1 },
  Quadrienal: { periodName: "years", periodAmount: 4 },
  Quinquenal: { periodName: "years", periodAmount: 5 },
  Decenal: { periodName: "years", periodAmount: 10 },
};

/* Subtract from a date a given number of periods.
 * The output date must be in ISO format.
 * Do not convert to local time, ignore time completely.
 */
function subtractDateByPeriod({ isoDateStr, period, offset }) {
  let newDate = new Date(isoDateStr);

  if (period === "Trimestral") {
    newDate = subQuarters(startOfQuarter(newDate), offset);
  } else if (period !== "Irregular") {
    const { periodName, periodAmount } = periodicities[period];
    newDate = sub(newDate, { [periodName]: offset * periodAmount });
  }

  return formatISO(newDate);
}
