import { seriesDivisions, SeriesDivision } from "api/ibge";

export function getDivisionSafely(
  division: string | null
): SeriesDivision | null {
  if (seriesDivisions.includes(division as SeriesDivision)) {
    return division as SeriesDivision;
  }

  return null;
}
