import { format } from "date-fns";

const dateFormats: Record<string, string> = {
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
