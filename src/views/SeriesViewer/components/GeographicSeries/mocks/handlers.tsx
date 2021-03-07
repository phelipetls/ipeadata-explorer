import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = (path: string) => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
  rest.get(/Metadados\('ACIDT'\)$/, (_, res, ctx) => {
    const json = readLocalJson("metadata.json");
    return res(ctx.status(200), ctx.json(json));
  }),
  rest.get(/Metadados\('ACIDT'\)\/Valores/, (req, res, ctx) => {
    const queries = req.url.searchParams;

    const json = queries.get("$apply")
      ? readLocalJson("geographic-divisions.json")
      : queries.get("$filter")?.includes("NIVNOME eq 'Estados'")
      ? readLocalJson("values-by-state.json")
      : readLocalJson("values.json");

    return res(ctx.status(200), ctx.json(json));
  }),
  rest.get(
    "https://servicodados.ibge.gov.br/api/v1/localidades/regioes",
    (_, res, ctx) => {
      const json = readLocalJson("regions.json");
      return res(ctx.status(200), ctx.json(json));
    }
  ),
  rest.get(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
    (_, res, ctx) => {
      const json = readLocalJson("states.json");
      return res(ctx.status(200), ctx.json(json));
    }
  ),
  rest.get(/malhas\/BR/, (req, res, ctx) => {
    const queries = req.url.searchParams;

    const json = queries.get("resolucao")
      ? readLocalJson("brazil-divided-by-state.json")
      : readLocalJson("brazil.json");

    return res(ctx.status(200), ctx.json(json));
  }),
  rest.get(/malhas\/1/, (_, res, ctx) => {
    const json = readLocalJson("northern-region-geojson.json");

    return res(ctx.status(200), ctx.json(json));
  }),
];
