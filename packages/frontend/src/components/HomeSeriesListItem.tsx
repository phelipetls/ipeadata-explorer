import { Chip } from './Chip'

type Props = {
  label: string
  isActive: boolean
  onClick: () => void
  activeClassName?: string
  inactiveClassName?: string
  className?: string
}

export function HomeSeriesListItem({
  label,
  onClick,
  className,
  isActive,
}: Props) {
  return (
    <Chip isActive={isActive} onClick={onClick} className={className}>
      {label}
    </Chip>
  )
}
