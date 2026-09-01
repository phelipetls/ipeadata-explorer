import { format } from 'date-fns'
import { ptBR as locale_ptBR } from 'date-fns/locale/pt-BR'

interface Props {
  lastUpdatedAt: Date
  isActive: boolean
}

export function SeriesLastUpdateStatus({ lastUpdatedAt, isActive }: Props) {
  return (
    <>
      Última atualização em{' '}
      {format(lastUpdatedAt, "dd ' de ' MMMM' de ' yyyy", {
        locale: locale_ptBR,
      })}
      {!isActive && <span className='text-text-error'> (descontinuada)</span>}
    </>
  )
}
