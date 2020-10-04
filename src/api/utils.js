import { formatISO, sub, subQuarters, startOfQuarter } from "date-fns";

export function formatDateFromDatePicker(dateStr) {
  if (!dateStr) return;
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day);
  return formatISO(date, { representation: "complete" });
}

export function subtractSeriesMaxDate({ metadata, offset }) {
  return subtractDateByPeriod({
    date: metadata.SERMAXDATA,
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

function subtractDateByPeriod({ date, period, offset }) {
  let newDate = new Date(date);

  if (period === "Trimestral") {
    newDate = subQuarters(startOfQuarter(newDate), offset);
  } else {
    const { periodName, periodAmount } = periodicities[period];
    newDate = sub(newDate, { [periodName]: offset * periodAmount });
  }

  return formatISO(newDate, { representation: "complete" });
}
