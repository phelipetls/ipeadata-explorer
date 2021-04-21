import { parse } from 'date-fns'

const isValidDate = (date: Date) => {
  return !isNaN(date.getTime());
};

export const getDateSafely = (dateStr: string | null): Date | null => {
  if (dateStr === null) {
    return null;
  }

  const date = parse(dateStr, 'dd/MM/yyyy', new Date());

  return isValidDate(date) ? date : null;
};
