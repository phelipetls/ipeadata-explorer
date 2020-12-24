// TODO: use this is SeriesMetadata
// Possible values that the field NIVNOME from a series metadata may assume
export type seriesDivisionType =
  | "Brasil"
  | "Área metropolitana"
  | "Regiões"
  | "Estados"
  | "Mesorregiões"
  | "Microrregiões"
  | "Municípios";

/** Official documentation for IBGE's maps API:
 *  https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
 */
const BASE_URL_MAPS = "https://servicodados.ibge.gov.br/api/v2/malhas/";

// We can use these to divide a map
export type mapDivisionType = Exclude<seriesDivisionType, "Área metropolitana">;

// Municipalities are useless as a boundary because they can't be further
// divided by district, neighborhood etc.
export type mapBoundaryType = Exclude<mapDivisionType, "Munícipios">;

const mapDivisionsCode: Record<mapDivisionType, number> = {
  Brasil: 0,
  Regiões: 1,
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5,
};

interface getMapUrlOptions {
  boundaryId: string;
  division?: mapDivisionType;
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

// We do not plot a map if user wants to see values for
// * Brazil
// * Metropolitan area
// * Regions
// A line chart will be plotted instead.
export type mapBoundaryDivisionType = Exclude<
  seriesDivisionType,
  "Brasil" | "Regiões" | "Área metropolitana"
>;

export function shouldPlotMap(
  division: seriesDivisionType
): division is mapBoundaryDivisionType {
  return (
    division !== "Brasil" &&
    division !== "Regiões" &&
    division !== "Área metropolitana"
  );
}

/**
 * Following the way regions are encoded by the IBGE API, the regions which
 * "contain" a given region are associated with a smaller number than the
 * contained region.
 */
export function getContainingDivisions(
  targetDivision: mapBoundaryDivisionType
): mapDivisionType[] {
  const divisions = [] as mapDivisionType[];
  const mapDivisionCode = mapDivisionsCode[targetDivision];

  for (const [division, code] of Object.entries(mapDivisionsCode)) {
    if (code < mapDivisionCode) {
      divisions.push(division as mapDivisionType);
    }
  }

  return divisions;
}

/** Official documentation for IBGE's locations API:
 *  https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
 */
const BASE_URL_DIVISIONS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/";

export type brazilSubDivisionsType = Exclude<mapDivisionType, "Brasil">;

// We need this to get a list of all Brazil's states, municipalities etc.
const divisionsEndpoints: Record<brazilSubDivisionsType, string> = {
  Regiões: "regioes",
  Estados: "estados",
  Mesorregiões: "mesorregioes",
  Microrregiões: "microrregioes",
  Municípios: "municipios",
};

export function getDivisionsUrl(division: brazilSubDivisionsType) {
  return BASE_URL_DIVISIONS + divisionsEndpoints[division];
}

export function unpluralize(s: string) {
  return s.replace(/ões$/, "ão").replace(/os$/, "o");
}

export interface divisionMetadataType {
  id: number;
  nome: string;
}

export async function getDivisionsMetadata(
  division: brazilSubDivisionsType
): Promise<divisionMetadataType[]> {
  const url = getDivisionsUrl(division);
  return await (await fetch(url)).json();
}
