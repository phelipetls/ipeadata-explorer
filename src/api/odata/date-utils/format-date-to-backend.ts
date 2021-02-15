interface formatDateToBackendOptions {
  isEndDate: boolean;
}

export function formatDateToBackend(
  date: Date,
  options: formatDateToBackendOptions = { isEndDate: false }
): string {
  // When date is at the end of an interval, give it a UTC -3 offset. This is
  // done to avoid excluding the end date because of timezone offsets.
  return (
    date.toISOString().slice(0, 10) +
    "T00:00:00" +
    (options.isEndDate ? "-03:00" : "Z")
  );
}
