import axios from "redaxios";
import { buildMetadataUrl } from "..";

export async function fetchMetadata(code: string) {
  const url = buildMetadataUrl(code);
  const response = await axios.get(url);
  return response.data;
}
