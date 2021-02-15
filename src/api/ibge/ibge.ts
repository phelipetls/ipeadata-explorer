import axios from "redaxios";

import {
  GeographicDivision,
  DivisionToPlotAsMap,
  IbgeMapDivision,
  IbgeLocationDivision,
} from "./types";

export const geographicDivisions: GeographicDivision[] = [
  "Brasil",
  "Área metropolitana",
  "Regiões",
  "Estados",
  "Mesorregiões",
  "Microrregiões",
  "Municípios",
];

// IBGE Maps API documentation:
// https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
const BASE_URL_MAPS = "https://servicodados.ibge.gov.br/api/v2/malhas/";

const mapDivisionsCode: Record<IbgeMapDivision, number> = {
  Brasil: 0,
  Regiões: 1,
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5,
};

interface getMapUrlOptions {
  boundaryId: string;
  division?: IbgeMapDivision;
  format?: string;
}

export function getMapUrl({
  boundaryId,
  division,
  format,
}: getMapUrlOptions): string {
  const url = new URL(boundaryId, BASE_URL_MAPS);

  url.searchParams.set("formato", format || "application/json");

  if (division) {
    url.searchParams.set("resolucao", String(mapDivisionsCode[division]));
  }

  return url.toString();
}

export function shouldPlotMap(
  division: GeographicDivision
): division is DivisionToPlotAsMap {
  return !(
    division === "Brasil" ||
    division === "Regiões" ||
    division === "Área metropolitana"
  );
}

/**
 * Following the way regions are encoded by the IBGE API, the regions which
 * "contain" a given region are associated with a smaller number than the
 * contained region.
 */
export function getContainingDivisions(
  targetDivision: DivisionToPlotAsMap
): IbgeMapDivision[] {
  const divisions = [] as IbgeMapDivision[];
  const mapDivisionCode = mapDivisionsCode[targetDivision];

  for (const [division, code] of Object.entries(mapDivisionsCode)) {
    if (code < mapDivisionCode) {
      divisions.push(division as IbgeMapDivision);
    }
  }

  return divisions;
}

// IBGE Locations API documentation:
// https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
const BASE_URL_DIVISIONS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/";

const divisionsEndpoints: Record<IbgeLocationDivision, string> = {
  Regiões: "regioes",
  Estados: "estados",
  Mesorregiões: "mesorregioes",
  Microrregiões: "microrregioes",
  Municípios: "municipios",
};

export function getDivisionNamesUrl(division: IbgeLocationDivision) {
  const endpoint = divisionsEndpoints[division];

  if (endpoint) {
    return BASE_URL_DIVISIONS + divisionsEndpoints[division];
  }

  throw new Error(
    `Invalid division: got ${division}, expected one of: ${Object.keys(
      divisionsEndpoints
    ).join(", ")}`
  );
}

export interface DivisionMetadata {
  id: number;
  nome: string;
}

export async function fetchDivisionNames(
  division: IbgeLocationDivision
): Promise<DivisionMetadata[]> {
  const url = getDivisionNamesUrl(division);
  const response = await axios.get(url);
  return response.data;
}
