import { getMapUrl, shouldPlotMap, getContainingDivisions } from "./ibge";

it("should return a correct url given id and resolution", () => {
  expect(getMapUrl({ id: "1", division: "Estados" })).toBe(
    "https://servicodados.ibge.gov.br/api/v2/malhas/" +
      "1?formato=application%2Fjson&resolucao=2"
  );
});

it("should plot map for every division except brazil, regions and metropolitan areas", () => {
  expect(shouldPlotMap("Brasil")).toBe(false);
  expect(shouldPlotMap("Regiões")).toBe(false);
  expect(shouldPlotMap("Área metropolitana")).toBe(false);
  expect(shouldPlotMap("Estados")).toBe(true);
  expect(shouldPlotMap("Microrregiões")).toBe(true);
  expect(shouldPlotMap("Microrregiões")).toBe(true);
  expect(shouldPlotMap("Municípios")).toBe(true);
});

test("if get containig division works", () => {
  expect(getContainingDivisions("Estados")).toStrictEqual([
    "Brasil",
    "Regiões",
  ]);
  expect(getContainingDivisions("Mesorregiões")).toStrictEqual([
    "Brasil",
    "Regiões",
    "Estados",
  ]);
  expect(getContainingDivisions("Microrregiões")).toStrictEqual([
    "Brasil",
    "Regiões",
    "Estados",
    "Mesorregiões",
  ]);
  expect(getContainingDivisions("Municípios")).toStrictEqual([
    "Brasil",
    "Regiões",
    "Estados",
    "Mesorregiões",
    "Microrregiões",
  ]);
});
