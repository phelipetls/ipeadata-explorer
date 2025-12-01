import { useState, useEffect } from 'react'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const abortController = new AbortController()

    mediaQuery.addEventListener(
      'change',
      (event) => {
        setMatches(event.matches)
      },
      {
        signal: abortController.signal,
      },
    )

    return () => {
      abortController.abort()
    }
  }, [query])

  return matches
}

export default useMediaQuery
