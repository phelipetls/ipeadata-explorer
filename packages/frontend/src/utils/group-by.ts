export function groupBy<
  T extends Record<string, unknown> = Record<string, unknown>,
>(arr: T[], getKey: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (result, item) => {
      const groupKey = String(getKey(item))

      if (!result[groupKey]) {
        result[groupKey] = []
      }

      result[groupKey].push(item)

      return result
    },
    {} as Record<string, T[]>,
  )
}
