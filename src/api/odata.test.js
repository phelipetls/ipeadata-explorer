import { limitByDate } from "./odata";

const baseUrl =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('ACIDT')/Valores?";

test("limitting by date", () => {
  expect(limitByDate(baseUrl, "01/02/2003", "01/02/2003")).toBe(
    baseUrl +
      "&$filter=VALDATA ge 2003-02-01T00:00:00-02:00 and VALDATA le 2003-02-01T00:00:00-02:00"
  );
});

const filteredUrl = baseUrl + "$filter=NIVNOME eq 'Brasil'";

test("limitting by date", () => {
  expect(limitByDate(filteredUrl, "01/02/2003", "01/02/2003")).toBe(
    filteredUrl +
      " and VALDATA ge 2003-02-01T00:00:00-02:00 and VALDATA le 2003-02-01T00:00:00-02:00"
  );
});

const multipleQueriesUrl = filteredUrl + "&$select=A,B,C";

test("limitting by date", () => {
  expect(limitByDate(multipleQueriesUrl, "01/02/2003", "01/02/2003")).toBe(
    filteredUrl +
      " and VALDATA ge 2003-02-01T00:00:00-02:00 and VALDATA le 2003-02-01T00:00:00-02:00" +
      "&$select=A,B,C"
  );
});
