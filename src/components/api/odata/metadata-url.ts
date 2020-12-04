export const BASE_URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/";

export function buildMetadataUrl(code: string) {
  return BASE_URL + `Metadados('${code}')`;
}
