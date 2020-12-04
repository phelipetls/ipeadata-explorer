import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = path => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
  rest.get(/Metadados$/, (req, res, ctx) => {
    const searchParams = req.url.searchParams;
    const filter = searchParams.get("$filter");
    const skip = searchParams.get("$skip");

    const isFirstPage = parseInt(skip) === 0;

    const json = !filter
      ? readLocalJson("results.json")
      : isFirstPage
      ? readLocalJson("results-filtered-first-page.json")
      : readLocalJson("results-filtered-second-page.json");

    return res(ctx.status(200), ctx.json(json));
  }),
];
