export function removeHtmlTags(text: string) {
  return text.replace(/<[^>]+>/g, '')
}
