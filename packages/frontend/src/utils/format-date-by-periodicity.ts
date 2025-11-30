import { ptBR as locale_ptBR } from 'date-fns/locale/pt-BR'
import { format } from 'date-fns'
import type { SeriesPeriodicity } from '../types'

export function formatByPeriodicity(
  date: Date,
  periodicity: SeriesPeriodicity,
): string {
  switch (periodicity) {
    case 'daily':
      return format(date, 'dd MMMM yyyy', { locale: locale_ptBR })
    case 'monthly':
      return format(date, 'MMMM yyyy', { locale: locale_ptBR })
    case 'decennial':
    case 'quadrennial':
    case 'yearly':
      return format(date, 'yyyy', { locale: locale_ptBR })
    case 'quarterly':
      return format(date, 'QQQ yyyy', { locale: locale_ptBR })
    default:
      periodicity satisfies never
      return date.toISOString()
  }
}
