import axios from "redaxios";
import { buildSearchUrl, limitQuery, offsetQuery } from "..";

type Options = {
  searchValues: Record<string, string>;
  page: number;
  rowsPerPage: number;
};

export async function fetchSeriesSearch(options: Options) {
  const { searchValues, page, rowsPerPage } = options;

  const url =
    buildSearchUrl(searchValues) +
    limitQuery(rowsPerPage) +
    offsetQuery(page * rowsPerPage);

  const response = await axios.get(url);
  return response.data;
}
