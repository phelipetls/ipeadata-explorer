import { buildMetadataUrl } from "./metadata-url";

const ORDER_BY_DATE_DESCENCING = "$orderby=VALDATA desc";
const DEFAULT_FIELDS_TO_SELECT = "$select=VALDATA,VALVALOR,TERCODIGO,TERNOME";

export function buildSeriesValuesUrl(code: string) {
  return (
    buildMetadataUrl(code) +
    `/Valores?${DEFAULT_FIELDS_TO_SELECT}&${ORDER_BY_DATE_DESCENCING}`
  );
}
