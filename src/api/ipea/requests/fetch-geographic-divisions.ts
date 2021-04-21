import { GeographicDivision } from "api/ibge";
import axios from "redaxios";
import { IpeaApiResponse } from "types";
import { buildGeographicDivisionsUrl } from "..";

export async function fetchGeographicDivisions(
  code: string
): Promise<GeographicDivision[]> {
  const url = buildGeographicDivisionsUrl(code);

  const response = await axios.get(url);
  const data = response.data as IpeaApiResponse<{ NIVNOME: GeographicDivision }[]>;

  return data.value.map(division => division.NIVNOME);
}
