import { buildFilter, limitByDate } from "./query-builders";

test("if buildFilter works", () => {
  expect(buildFilter("a", "b", "", "c")).toBe("&$filter=a and b and c");
});

test("if limitByDate works", () => {
  expect(limitByDate({ start: "01/02/2020", end: "05/02/2020" })).toBe(
    "VALDATA ge 01/02/2020 and VALDATA le 05/02/2020"
  );

  expect(limitByDate({ start: "01/02/2020" })).toBe("VALDATA ge 01/02/2020");

  expect(limitByDate({ end: "01/02/2020" })).toBe("VALDATA le 01/02/2020");
});
