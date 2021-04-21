import { GeographicDivision } from "api/ibge";
import axios from "redaxios";
import { IpeaApiResponse, SeriesValuesGeographic } from "types";
import { buildGeographicDivisionsUrl } from "..";

export async function fetchGeographicDivisions(
  code: string
): Promise<GeographicDivision[]> {
  const url = buildGeographicDivisionsUrl(code);

  const response = await axios.get<IpeaApiResponse<SeriesValuesGeographic[]>>(
    url
  );
  const data = response.data;

  return data.value.map(row => row.NIVNOME);
}
