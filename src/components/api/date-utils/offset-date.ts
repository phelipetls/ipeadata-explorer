import { sub, subQuarters, startOfQuarter } from "date-fns";
import { formatDateToBackend } from "./format-date-to-backend";

interface Periodicity {
  name: string;
  amount: number;
}

interface Periodicities {
  [periodicity: string]: Periodicity;
}

const periodicities: Periodicities = {
  Diária: { name: "days", amount: 1 },
  Mensal: { name: "months", amount: 1 },
  Anual: { name: "years", amount: 1 },
  Quadrienal: { name: "years", amount: 4 },
  Quinquenal: { name: "years", amount: 5 },
  Decenal: { name: "years", amount: 10 },
};

interface offsetDateOptions {
  date: Date;
  period: string;
  offset: number;
}

/* Subtract from date according to periodicity. */
export function offsetDate({ date, period, offset }: offsetDateOptions) {
  if (period === "Irregular") {
    return formatDateToBackend(date);
  }

  if (period === "Trimestral") {
    date = subQuarters(startOfQuarter(date), offset);
  } else {
    const { name, amount } = periodicities[period];

    date = sub(date, { [name]: offset * amount });
  }

  return formatDateToBackend(date);
}
