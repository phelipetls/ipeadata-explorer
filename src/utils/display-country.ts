import { COUNTRIES } from '../consts'

export function displayCountry(code: string) {
  return COUNTRIES[code as keyof typeof COUNTRIES] ?? code
}
