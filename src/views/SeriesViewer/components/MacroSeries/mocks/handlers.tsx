import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = (path: string) => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
  rest.get(/Metadados\('BM12_TJOVER12'\)\/Valores/, (req, res, ctx) => {
    const filter = req.url.searchParams.get("$filter");

    const dateFilter =
      "VALDATA ge 2019-01-01T00:00:00Z and VALDATA le 2020-01-01T00:00:00-03:00";

    const lastNFilter = "VALDATA ge 2020-07-01T00:00:00Z";

    let json;

    if (filter === dateFilter) {
      json = readLocalJson("values-date-interval.json");
    } else if (filter === lastNFilter) {
      json = readLocalJson("values-lastn.json");
    } else {
      json = readLocalJson("values.json");
    }

    return res(ctx.status(200), ctx.json(json));
  }),
];
