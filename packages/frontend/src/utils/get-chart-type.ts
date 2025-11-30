import type { SeriesDatabase } from '../types'

type Options = {
  database: SeriesDatabase
  regionalDivision?: string
}

export function getChartType({ database, regionalDivision }: Options) {
  if (database === 'macroeconomic') {
    return 'line'
  }

  if (database === 'regional' || database === 'social') {
    if (regionalDivision === 'brazil' || regionalDivision === 'regions') {
      return 'line'
    }
    return 'map'
  }

  return 'line'
}
