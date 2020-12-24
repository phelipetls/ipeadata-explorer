import { buildMetadataUrl } from "./metadata-url";

const COUNT_BY_CATEGORY = "groupby((VALVALOR),aggregate($count as count))";
const ORDER_BY_COUNT_DESCENDING = "$orderby=count desc";

export interface CategoriesMetadata {
  VALVALOR: string;
  count: number;
}

export function buildCountByCategoryUrl(
  code: string,
  { filter }: { filter: string }
) {
  const applyQuery = `$apply=filter(${filter})/${COUNT_BY_CATEGORY}`;

  return (
    buildMetadataUrl(code) +
    `/ValoresStr?${applyQuery}&${ORDER_BY_COUNT_DESCENDING}`
  );
}
