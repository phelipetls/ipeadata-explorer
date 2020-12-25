// TODO: use this is SeriesMetadata
// Possible values that the field NIVNOME from a series metadata may assume
export type SeriesDivision =
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
export type IbgeMapDivision = Exclude<SeriesDivision, "Área metropolitana">;

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

// We do not plot a map if user wants to see values for
// * Brazil
// * Metropolitan area
// * Regions
// A line chart will be plotted instead.
export type MapDivision = Exclude<
  SeriesDivision,
  "Brasil" | "Regiões" | "Área metropolitana"
>;

export function shouldPlotMap(
  division: SeriesDivision
): division is MapDivision {
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
  targetDivision: MapDivision
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

/** Official documentation for IBGE's locations API:
 *  https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
 */
const BASE_URL_DIVISIONS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/";

// Municipalities are useless as a boundary because they can't be further
// divided by district, neighborhood etc.
export type BoundaryDivision = Exclude<IbgeMapDivision, "Municípios">;

// We need to fetch each municipality, state, region etc. so the user can
// choose which one be used as a boundary, e.g. Rio de Janeiro if boundary is
// state.
export type BoundaryDivisionToBeListed = Exclude<BoundaryDivision, "Brasil">;

// We need this to get a list of all Brazil's states, municipalities etc.
const divisionsEndpoints: Record<BoundaryDivisionToBeListed, string> = {
  Regiões: "regioes",
  Estados: "estados",
  Mesorregiões: "mesorregioes",
  Microrregiões: "microrregioes",
};

export function listBoundaryDivision(division: BoundaryDivisionToBeListed) {
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
  division: BoundaryDivisionToBeListed
): Promise<divisionMetadataType[]> {
  const url = listBoundaryDivision(division);
  return await (await fetch(url)).json();
}
