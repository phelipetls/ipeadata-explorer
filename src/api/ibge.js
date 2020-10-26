export function getChartType(geoDivision) {
  return geoDivision === "Brasil" ||
    geoDivision === "Regiões" ||
    geoDivision === "Área metropolitana"
    ? "line"
    : "map";
}

/** Official documentation for IBGE's maps API:
 *  https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
 */
const BASE_URL_MAPS = "https://servicodados.ibge.gov.br/api/v2/malhas/";

const ibgeGeoRegionsCodes = {
  Brasil: 0,
  Regiões: 1,
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5,
};

export function getMapUrl({ geoBoundaryValue, geoDivision }) {
  const url = new URL(geoBoundaryValue, BASE_URL_MAPS);

  url.searchParams.set("formato", "application/json");

  if (geoDivision) {
    url.searchParams.set("resolucao", ibgeGeoRegionsCodes[geoDivision]);
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
export function getContainingRegions(geoRegion) {
  const geoRegionCode = ibgeGeoRegionsCodes[geoRegion];
  return Object.entries(ibgeGeoRegionsCodes)
    .filter(([_, code]) => code < geoRegionCode)
    .map(([region]) => region);
}

/** Official documentation for IBGE's locations API:
 *  https://servicodados.ibge.gov.br/api/docs/localidades?versao=1
 */

const geoRegionEndpoints = {
  Regiões: "regioes",
  Estados: "estados",
  Mesorregiões: "mesorregioes",
  Microrregiões: "microrregioes",
  Municípios: "municipios",
};

const BASE_URL_LOCATIONS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/";

export function getRegionsUrl(geoRegionType) {
  return new URL(
    geoRegionEndpoints[geoRegionType],
    BASE_URL_LOCATIONS
  ).toString();
}

export function unpluralize(str) {
  return str.replace(/ões$/, "ão").replace(/os$/, "o");
}
