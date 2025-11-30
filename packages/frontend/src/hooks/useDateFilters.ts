import { parseAsString, useQueryStates, createParser } from 'nuqs'
import { parse, format, isValid } from 'date-fns'

const parseAsDate = createParser({
  parse(queryValue) {
    const date = parse(queryValue, 'yyyy-MM-dd', new Date())
    if (!isValid(date)) return null
    return date
  },
  serialize(value) {
    return format(value, 'yyyy-MM-dd')
  },
})

export function useDateFilters({
  defaultValue,
}: {
  defaultValue: { startDate: Date; endDate: Date; preset: string }
}) {
  const [dateFilter, setDateFilter] = useQueryStates({
    preset: parseAsString.withDefault(defaultValue.preset),
    startDate: parseAsDate.withDefault(defaultValue.startDate),
    endDate: parseAsDate.withDefault(defaultValue.endDate),
  })

  return { dateFilter, setDateFilter }
}
