import Fuse from 'fuse.js'
import type { SeriesMetadata } from '../api/ipea/get-all-metadata'

type SearchItem = {
  code: string
  name: string
}

const WEIGHTS = {
  name: 0.75,
  code: 0.25,
}

export function filterSeries(
  series: SeriesMetadata[],
  query: string,
  limit = 50,
): SearchItem[] {
  const searchable = series
    .filter((item) => item.SERNUMERICA !== false)
    .map((item) => ({
      code: item.SERCODIGO,
      name: item.SERNOME,
    }))

  const fuse = new Fuse(searchable, {
    keys: [
      { name: 'name', weight: WEIGHTS.name },
      { name: 'code', weight: WEIGHTS.code },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    shouldSort: true,
    minMatchCharLength: 2,
  })

  return fuse
    .search(query.trim())
    .slice(0, limit)
    .map((result) => result.item)
}
