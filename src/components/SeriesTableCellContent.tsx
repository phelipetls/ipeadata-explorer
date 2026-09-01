import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  children: string | Date | number | null
}

export function SeriesTableCellContent({ children }: Props) {
  const metadata = useSeriesMetadataContext()

  let content: string

  if (children === null) {
    content = '-'
  } else if (typeof children === 'string') {
    content = children
  } else if (children instanceof Date) {
    const periodicity = metadata.periodicity
    switch (periodicity) {
      case 'decennial':
      case 'quadrennial':
      case 'yearly':
        content = format(children, 'yyyy', { locale: ptBR })
        break
      case 'quarterly':
        content = format(children, 'QQQ yyyy', { locale: ptBR })
        break
      case 'monthly':
        content = format(children, 'MMM yyyy', { locale: ptBR })
        break
      case 'daily':
        content = format(children, 'dd MMM yyyy', { locale: ptBR })
        break
      default:
        periodicity satisfies never
        content = format(children, 'yyyy-MM-dd')
    }
  } else if (typeof children === 'number') {
    const numberFormatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: metadata.decimalPlaces,
      maximumFractionDigits: metadata.decimalPlaces,
    })
    const formattedNumber = numberFormatter.format(children)
    content = metadata.unit.includes('%')
      ? formattedNumber + '%'
      : formattedNumber
  } else {
    content = '-'
  }

  return content
}
