import { sub, subQuarters, startOfQuarter, format } from "date-fns";

const dateFormats = {
  Diária: "dd-MM-yyyy",
  Mensal: "MM-yyyy",
  Trimestral: "qQ yyyy",
};

export function formatDate(date, periodicity) {
  const dateFormat = dateFormats[periodicity] || "yyyy";
  return format(date, dateFormat);
}

function formatISO(date) {
  return date.toISOString().slice(0, 10) + "T00:00:00-00:00";
}

export function formatDateFromDatePicker(dateStr) {
  if (!dateStr) return;
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day);
  return formatISO(date);
}

export function getLastNDates({ metadata, offset }) {
  return offsetDateByPeriod({
    isoDateStr: metadata.SERMAXDATA,
    period: metadata.PERNOME,
    // To get last 1 period, we need to
    // subtract it 0 times.
    offset: offset - 1,
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
export function offsetDateByPeriod({ isoDateStr, period, offset }) {
  let newDate = new Date(isoDateStr);

  if (period === "Trimestral") {
    newDate = subQuarters(startOfQuarter(newDate), offset);
  } else if (period !== "Irregular") {
    const { periodName, periodAmount } = periodicities[period];
    newDate = sub(newDate, {
      [periodName]: offset * periodAmount,
    });
  }

  return formatISO(newDate);
}
