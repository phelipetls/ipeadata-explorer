import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = (path: string) => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
  rest.get(/Metadados$/, (req, res, ctx) => {
    const searchParams = req.url.searchParams;

    const filter = searchParams.get("$filter");
    const skip = searchParams.get("$skip");

    const isFirstPage = skip && Number(skip) === 0;

    const json = filter
      ? readLocalJson("results-filtered.json")
      : isFirstPage
      ? readLocalJson("results-first-page.json")
      : readLocalJson("results-second-page.json");

    return res(ctx.status(200), ctx.json(json));
  }),
];
