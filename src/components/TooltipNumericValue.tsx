import { useSeriesMetadataContext } from '../context/SeriesMetadataContext'

interface TooltipNumericValueProps {
  value: number
}

export function TooltipNumericValue({ value }: TooltipNumericValueProps) {
  const metadata = useSeriesMetadataContext()

  const numFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: metadata.decimalPlaces,
    maximumFractionDigits: metadata.decimalPlaces,
  })

  const isPercentage = metadata.unit ? metadata.unit.includes('%') : false

  const formattedValue = isPercentage
    ? numFormatter.format(value) + '%'
    : numFormatter.format(value)

  return <span>{formattedValue}</span>
}
