import { BASE_URL_MAPS, getMapUrl } from "./ibge";

test("it should return a correct url given id and resolution", () => {
  expect(getMapUrl({ geoBoundaryValue: 1, geoDivision: "Estados" })).toBe(
    "https://servicodados.ibge.gov.br/api/v2/malhas/" +
    "1?formato=application%2Fjson&resolucao=2"
  );
});
