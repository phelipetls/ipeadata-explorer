import { geographicDivisions, GeographicDivision } from "api/ibge";

export function getDivisionSafely(
  division: string | null
): GeographicDivision | null {
  if (geographicDivisions.includes(division as GeographicDivision)) {
    return division as GeographicDivision;
  }

  return null;
}
