import { getMapUrl } from "./ibge";

test("it should return a correct url given id and resolution", () => {
  expect(getMapUrl({ boundaryId: 1, division: "Estados" })).toBe(
    "https://servicodados.ibge.gov.br/api/v2/malhas/" +
      "1?formato=application%2Fjson&resolucao=2"
  );
});
