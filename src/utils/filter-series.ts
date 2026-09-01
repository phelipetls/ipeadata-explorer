import type { MetadataItem } from '../api/ipea/get-all-metadata'

type SearchItem = {
  code: string
  name: string
}

function normalizeStr(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function filterSeries(
  metadata: MetadataItem[],
  query: string,
): SearchItem[] {
  const words = query.trim() ? normalizeStr(query).split(/\s+/) : []
  const results: SearchItem[] = []

  for (const item of metadata) {
    if (item.SERNUMERICA === false) {
      continue
    }

    if (words.length > 0) {
      const normalizedName = normalizeStr(item.SERNOME)
      const normalizedCode = normalizeStr(item.SERCODIGO)

      const matchesAllWords = words.every(
        (word) =>
          normalizedName.includes(word) || normalizedCode.includes(word),
      )

      if (!matchesAllWords) {
        continue
      }
    }

    results.push({
      code: item.SERCODIGO,
      name: item.SERNOME,
    })

    if (words.length > 0 && results.length >= 50) {
      break
    }
  }

  return results
}
