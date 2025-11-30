const computedStyle = getComputedStyle(document.documentElement)

export function getCssVariable(variableName: string): string {
  return computedStyle.getPropertyValue(variableName).trim()
}
