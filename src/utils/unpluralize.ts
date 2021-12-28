export function unpluralize(s: string) {
  return s.replace(/ões$/, 'ão').replace(/os$/, 'o')
}
