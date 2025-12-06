type DateFormatter = (d: Date) => string

export function formatDateRange(
  startDate: Date,
  endDate: Date,
  formatter: DateFormatter,
) {
  const formattedStart = formatter(startDate)
  const formattedEnd = formatter(endDate)

  // If both formatted dates are the same, return only one
  if (formattedStart === formattedEnd) {
    return formattedStart
  }

  // Otherwise, concatenate with " - "
  return `${formattedStart} - ${formattedEnd}`
}
