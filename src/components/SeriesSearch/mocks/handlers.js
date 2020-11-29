import { rest } from "msw";
import { readJson } from "test-utils";

export const handlers = [
  rest.get(/Metadados$/, (req, res, ctx) => {
    const filter = req.url.searchParams.get("$filter");

    const json = filter
      ? readJson(__dirname + "/search-results-filtered.json")
      : readJson(__dirname + "/search-results.json");

    return res(ctx.status(200), ctx.json(json));
  })
];
