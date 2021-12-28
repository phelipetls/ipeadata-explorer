export function formatDateToBackend(date: Date): string {
  return date.toISOString().slice(0, 10) + 'T00:00:00-03:00'
}
