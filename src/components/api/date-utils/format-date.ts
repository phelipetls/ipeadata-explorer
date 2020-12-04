import { format } from "date-fns";

interface dateFormatsType {
  [format: string]: string;
}

const dateFormats: dateFormatsType = {
  Diária: "dd-MM-yyyy",
  Mensal: "MM-yyyy",
  Trimestral: "qQ yyyy",
};

interface formatDateOptions {
  periodicity: string;
}

export function formatDate(date: Date, { periodicity }: formatDateOptions) {
  const dateFormat = dateFormats[periodicity] || "yyyy";
  return format(date, dateFormat);
}
