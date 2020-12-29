import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = (path: string) => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
  rest.get(/Paises/, (req, res, ctx) => {
    const searchParams = req.url.searchParams;
    const expand = searchParams.get("$expand");

    if (expand !== "Metadados($select=SERCODIGO;$count=true)") {
      return;
    }

    const json = readLocalJson("countries.json");

    return res(ctx.status(200), ctx.json(json));
  }),
];
