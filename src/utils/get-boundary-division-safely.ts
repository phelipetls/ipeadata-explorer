import { BoundaryDivision, geographicDivisions } from "api/ibge";

const boundaryDivisions = geographicDivisions.filter(
  (division) =>
    !(division === "Municípios" || division === "Área metropolitana")
);

export function getBoundaryDivisionSafely(
  division: string | null
): BoundaryDivision | null {
  if (boundaryDivisions.includes(division as BoundaryDivision)) {
    return division as BoundaryDivision;
  }

  return null;
}
