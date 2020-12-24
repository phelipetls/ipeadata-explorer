export type divisionType =
  | "Brasil"
  | "Regiões"
  | "Estados"
  | "Mesorregiões"
  | "Microrregiões"
  | "Municípios";
export type brazilSubDivisionType = Exclude<divisionType, "Brasil">;

export function shouldPlotMap(division: divisionType): boolean {
  return !["Brasil", "Regiões", "Área metropolitana"].includes(division);
}

/** Official documentation for IBGE's maps API:
 *  https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
 */
const BASE_URL_MAPS = "https://servicodados.ibge.gov.br/api/v2/malhas/";

const divisionsCode: Record<divisionType, number> = {
  Brasil: 0,
  Regiões: 1,
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5,
};

interface getMapUrlOptions {
  boundaryId: string;
  division?: divisionType;
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
    url.searchParams.set("resolucao", String(divisionsCode[division]));
  }

  return url.toString();
}

/**
 * Returns geographic regions which "contains" a given geographic
 * region.
 *
 * Following the way regions are encoded by the IBGE API (see variable
 * `ibgeGeoRegionsCodes`), the regions which "contain" a given region have
 * smaller code numbers.
 *
 * @param {string} division - A geographic region, one from the set of
 * "Estados", "Mesorregiões", "Microrregiões", "Municípios".
 *
 */
export function getContainingDivisions(
  targetDivision: divisionType
): divisionType[] {
  const divisions = [] as divisionType[];
  const divisionCode = divisionsCode[targetDivision];

  for (const [division, code] of Object.entries(divisionsCode)) {
    if (code < divisionCode) {
      divisions.push(division as divisionType);
    }
  }

  return divisions;
}

/** Official documentation for IBGE's locations API:
 *  https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
 */
const BASE_URL_DIVISIONS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/";

type divisionsEndpointsType = {
  [K in brazilSubDivisionType]: string;
};

const divisionsEndpoints: divisionsEndpointsType = {
  Regiões: "regioes",
  Estados: "estados",
  Mesorregiões: "mesorregioes",
  Microrregiões: "microrregioes",
  Municípios: "municipios",
};

export function getDivisionsUrl(division: brazilSubDivisionType) {
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
  division: brazilSubDivisionType
): Promise<divisionMetadataType[]> {
  const url = getDivisionsUrl(division);
  return await (await fetch(url)).json();
}
