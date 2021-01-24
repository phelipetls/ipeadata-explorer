const isValidDate = (date: Date) => {
 return !isNaN(date.getTime())
}

export const getDateSafely = (dateStr: string | null): Date | null => {
  if (dateStr === null) {
    return null;
  }

  const date = new Date(dateStr);

  return isValidDate(date) ? date : null;
};
