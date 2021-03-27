import {
  buildMetadataUrl,
  buildSeriesValuesUrl,
  buildCountByCategoryUrl,
} from "./url-builders";

test("if buildMetadataUrl works", () => {
  expect(buildMetadataUrl("CODE")).toBe(
    "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('CODE')"
  );
});

test("if buildSeriesUrl works", () => {
  expect(buildSeriesValuesUrl("CODE")).toBe(
    "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('CODE')/Valores?" +
      "$select=VALDATA,VALVALOR,TERCODIGO,TERNOME&$orderby=VALDATA desc"
  );
});

test("if buildCountByCategoryUrl works", () => {
  expect(buildCountByCategoryUrl("CODE", { filter: "filter" })).toBe(
    "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('CODE')/ValoresStr?" +
      "$apply=filter(filter)/groupby((VALVALOR),aggregate($count as count))" +
      "&$orderby=count desc"
  );
});
