import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = (path: string) => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
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
];
