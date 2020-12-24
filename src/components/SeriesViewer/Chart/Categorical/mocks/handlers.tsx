import { rest } from "msw";
import { readJson } from "test-utils";

const readLocalJson = (path: string) => {
  return readJson(__dirname + "/" + path);
};

export const handlers = [
  rest.get(/Metadados\('F1PT1'\)$/, (_, res, ctx) => {
    const json = readLocalJson("metadata.json");
    return res(ctx.status(200), ctx.json(json));
  }),
  rest.get(/Metadados\('F1PT1'\)\/ValoresStr/, (_, res, ctx) => {
    const json = readLocalJson("values.json");
    return res(ctx.status(200), ctx.json(json));
  }),
];
