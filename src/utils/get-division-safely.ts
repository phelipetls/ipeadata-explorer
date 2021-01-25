import { SeriesDivision } from "api/ibge";

const seriesDivisions = [
  "Brasil",
  "Área metropolitana",
  "Regiões",
  "Estados",
  "Mesorregiões",
  "Microrregiões",
  "Municípios",
];

export function getDivisionSafely(
  division: string | null
): SeriesDivision | null {
  if (division === null || !seriesDivisions.includes(division)) {
    return null;
  }

  return division as SeriesDivision;
}
