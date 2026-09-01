import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { SeriesMetadata } from '../utils/format-series-metadata'

const SeriesMetadataContext = createContext<SeriesMetadata | null>(null)

export function SeriesMetadataProvider({
  children,
  metadata,
}: {
  children: ReactNode
  metadata: SeriesMetadata
}) {
  return (
    <SeriesMetadataContext.Provider value={metadata}>
      {children}
    </SeriesMetadataContext.Provider>
  )
}

export function useSeriesMetadataContext(): SeriesMetadata {
  const context = useContext(SeriesMetadataContext)
  if (!context) {
    throw new Error(
      'useSeriesMetadataContext must be used within SeriesMetadataProvider',
    )
  }
  return context
}
