import { sub, subQuarters, startOfQuarter, format } from "date-fns";

const dateFormats = {
  Diária: "dd-MM-yyyy",
  Mensal: "MM-yyyy",
  Trimestral: "qQ yyyy",
};

export function formatDate(date, { periodicity }) {
  const dateFormat = dateFormats[periodicity] || "yyyy";
  return format(date, dateFormat);
}

function formatISO(date, options = { isEndDate: false }) {
  // When date is at the end of an interval, give it a UTC -3 offset. This is
  // done to avoid excluding the end date because of timezone offsets.
  return (
    date.toISOString().slice(0, 10) +
    "T00:00:00" +
    (options.isEndDate ? "-03:00" : "Z")
  );
}

export function formatDateFromDatePicker(dateStr, options) {
  if (!dateStr) return;
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day);
  return formatISO(date, options);
}

export function getLastNDates({ metadata, offset }) {
  return offsetDateByPeriod({
    isoDateStr: metadata.SERMAXDATA,
    period: metadata.PERNOME,
    // If the user wants just the last observation, what we really need is to
    // not change the last observation date at all (subtract it 0 times).
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
