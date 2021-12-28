import { format } from 'date-fns'
import * as React from 'react'
import { useHistory } from 'react-router'

type State = Record<string, string | number | Date | null>

export function useSyncSearchParams(state: State) {
  const history = useHistory()

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(state)) {
      if (value instanceof Date) {
        newSearchParams.set(key, format(value, 'dd/MM/yyyy'))
      } else if (typeof value === 'number') {
        newSearchParams.set(key, String(value))
      } else if (value !== null) {
        newSearchParams.set(key, value)
      }
    }

    history.push({ search: `?${newSearchParams}` })
  }, [state, history])
}
