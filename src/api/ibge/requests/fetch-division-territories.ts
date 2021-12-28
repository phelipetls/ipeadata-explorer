import axios from 'redaxios'
import { getDivisionNamesUrl, IbgeLocationDivision } from '..'

type Territory = { id: number; nome: string }

export async function fetchDivisionTerritories(division: IbgeLocationDivision) {
  const url = getDivisionNamesUrl(division)
  const response = await axios.get<Territory[]>(url)
  return response.data
}
