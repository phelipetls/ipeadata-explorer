import type { FeatureCollection, Geometry } from 'geojson'
import type { RegionalLevel } from '../../types'

type IntraRegionalLevel = Extract<
  RegionalLevel,
  'regions' | 'states' | 'municipalities'
>

const intraRegionToMapUrl: Record<IntraRegionalLevel, string> = {
  regions: 'maps/brazil-regions.json',
  states: 'maps/brazil-states.json',
  municipalities: 'maps/brazil-municipalities.json',
}

type Data = FeatureCollection<
  Geometry,
  {
    code: number
    name: string
    value: number
  }
>

export async function getBrazilMap(options: {
  intraRegion: IntraRegionalLevel | null
  signal?: AbortSignal
}): Promise<Data> {
  const url =
    options.intraRegion === null
      ? 'maps/brazil.json'
      : intraRegionToMapUrl[options.intraRegion]

  const response = await fetch(`${import.meta.env.VITE_APP_BASENAME}${url}`, {
    signal: options?.signal,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch map')
  }

  const json = await response.json()
  return json
}
