import * as z from 'zod'

const themesSchema = z.object({
  value: z.array(
    z.object({
      TEMCODIGO: z.number(),
      TEMNOME: z.string().nullable(),
    }),
  ),
})

type ThemesMap = Record<number, string>

export async function getThemes(options?: {
  signal?: AbortSignal
}): Promise<ThemesMap> {
  const url = `${import.meta.env.VITE_API_URL}/Temas`
  const response = await fetch(url, { signal: options?.signal })
  if (!response.ok) {
    throw new Error('Failed to fetch themes')
  }

  const json = await response.json()
  const result = themesSchema.safeParse(json)
  if (!result.success) {
    throw new Error(`Unexpected themes format: ${result.error}`)
  }

  const themes: ThemesMap = {}
  for (const item of result.data.value) {
    if (item.TEMNOME) {
      themes[item.TEMCODIGO] = item.TEMNOME
    }
  }

  return themes
}
