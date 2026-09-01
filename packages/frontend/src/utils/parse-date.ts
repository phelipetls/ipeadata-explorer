import { parseISO } from 'date-fns'

export function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date()
  return parseISO(dateStr.slice(0, 10))
}
