import {
  limitByDate,
  buildMetadataUrl,
  buildSeriesUrl,
  buildFilter,
  buildCountByCategoryUrl,
} from "./odata";

test("if buildMetadataUrl works", () => {
  expect(buildMetadataUrl("CODE")).toBe(
    "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('CODE')"
  );
});

test("if buildSeriesUrl works", () => {
  expect(buildSeriesUrl("CODE")).toBe(
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

test("if buildFilter works", () => {
  expect(buildFilter("a", "b", "", "c")).toBe("&$filter=a and b and c");
});

test("if limitByDate works", () => {
  expect(limitByDate("01/02/2020", "05/02/2020")).toBe(
    "VALDATA ge 01/02/2020 and VALDATA le 05/02/2020"
  );

  expect(limitByDate("01/02/2020")).toBe(
    "VALDATA ge 01/02/2020"
  );

  expect(limitByDate(undefined, "01/02/2020")).toBe(
    "VALDATA le 01/02/2020"
  );
});
