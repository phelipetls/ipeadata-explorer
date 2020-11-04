export function getChartType(division) {
  return division === "Brasil" ||
    division === "Regiões" ||
    division === "Área metropolitana"
    ? "line"
    : "map";
}

/** Official documentation for IBGE's maps API:
 *  https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
 */
const BASE_URL_MAPS = "https://servicodados.ibge.gov.br/api/v2/malhas/";

const divisionsCode = {
  Brasil: 0,
  Regiões: 1,
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5,
};

export function getMapUrl({ boundaryId, division, format }) {
  const url = new URL(boundaryId, BASE_URL_MAPS);

  url.searchParams.set("formato", format || "application/json");

  if (division) {
    url.searchParams.set("resolucao", divisionsCode[division]);
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
 * @param {string} geoRegion - A geographic region, one from the set of
 * "Estados", "Mesorregiões", "Microrregiões", "Municípios".
 *
 */
export function getContainingDivisions(geoRegion) {
  const geoRegionCode = divisionsCode[geoRegion];
  return Object.entries(divisionsCode)
    .filter(([_, code]) => code < geoRegionCode)
    .map(([region]) => region);
}

/** Official documentation for IBGE's locations API:
 *  https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
 */
const BASE_URL_DIVISIONS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/";

const divisions = {
  Regiões: "regioes",
  Estados: "estados",
  Mesorregiões: "mesorregioes",
  Microrregiões: "microrregioes",
  Municípios: "municipios",
};

export function getDivisionsUrl(division) {
  return new URL(divisions[division], BASE_URL_DIVISIONS).toString();
}

export function unpluralize(str) {
  return str.replace(/ões$/, "ão").replace(/os$/, "o");
}
