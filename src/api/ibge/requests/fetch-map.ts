import { Feature } from 'geojson'
import axios from 'redaxios'
import { getMapUrl } from '..'

export async function fetchMap(id: string): Promise<Feature> {
  const url = getMapUrl({ id, format: 'application/vnd.geo+json' })
  const response = await axios.get(url)
  return response.data
}
