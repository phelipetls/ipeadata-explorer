import axios from "redaxios";
import { getDivisionNamesUrl, IbgeLocationDivision } from "..";

export async function fetchDivisionNames(
  division: IbgeLocationDivision
): Promise<{ id: number; nome: string }[]> {
  const url = getDivisionNamesUrl(division);
  const response = await axios.get(url);
  return response.data;
}
