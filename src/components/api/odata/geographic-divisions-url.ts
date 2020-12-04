import { buildMetadataUrl } from "./metadata-url";

// AMCs are not real delimited geographic divisions
const EXCLUDE_AMC_REGIONS = "filter(not startswith(NIVNOME,'AMC'))";
const COUNT_BY_DIVISION = "groupby((NIVNOME),aggregate($count as count))";
// Divisions with less values first to get the least complex division (usually
// no division, e.g., the whole Brazil, or as few as possible, e.g., Regions,
// States)
const ORDER_BY_COUNT_ASCENDING = "$orderby=count asc";

export function buildGeographicDivisionsUrl(code: string) {
  return (
    buildMetadataUrl(code) +
    "/Valores?" +
    `$apply=${EXCLUDE_AMC_REGIONS}` +
    `/${COUNT_BY_DIVISION}` +
    `&${ORDER_BY_COUNT_ASCENDING}`
  );
}
