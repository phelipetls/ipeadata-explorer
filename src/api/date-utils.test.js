import { offsetDateByPeriod } from "./date-utils";

test("subtracting by daily period", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-02T00:00:00-03:00",
      period: "Diária",
      offset: 1,
    })
  ).toBe("2020-06-01T00:00:00-00:00");

  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Diária",
      offset: 1,
    })
  ).toBe("2020-05-31T00:00:00-00:00");
});

test("subtracting by monthly period", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Mensal",
      offset: 1,
    })
  ).toBe("2020-05-01T00:00:00-00:00");

  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-01-01T00:00:00-03:00",
      period: "Mensal",
      offset: 1,
    })
  ).toBe("2019-12-01T00:00:00-00:00");
});

test("subtracting by quarterly period, the month must correspond to the quarter's initial month", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Trimestral",
      offset: 1,
    })
  ).toBe("2020-01-01T00:00:00-00:00");

  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-10-01T00:00:00-03:00",
      period: "Trimestral",
      offset: 1,
    })
  ).toBe("2020-07-01T00:00:00-00:00");

  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-10-01T00:00:00-03:00",
      period: "Trimestral",
      offset: 4,
    })
  ).toBe("2019-10-01T00:00:00-00:00");
});

test("subtracting by yearly period", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Anual",
      offset: 1,
    })
  ).toBe("2019-06-01T00:00:00-00:00");
});

test("subtracting by quadriennal period", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Quadrienal",
      offset: 1,
    })
  ).toBe("2016-06-01T00:00:00-00:00");
});

test("subtracting by quinquennal period", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Quinquenal",
      offset: 1,
    })
  ).toBe("2015-06-01T00:00:00-00:00");
});

test("subtracting by decennal period", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Decenal",
      offset: 1,
    })
  ).toBe("2010-06-01T00:00:00-00:00");
});

test("subtracting date from irregular periodicity", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "1907-01-01T00:00:00-03:00",
      period: "Irregular",
      offset: 1,
    })
  ).toBe("1907-01-01T00:00:00-00:00");
});

test("subtracting problematic timezone offset", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "1907-01-01T00:00:00-02:00",
      period: "Irregular",
      offset: 1,
    })
  ).toBe("1907-01-01T00:00:00-00:00");
});

test("subtracting with a 0 offset does not change the date", () => {
  expect(
    offsetDateByPeriod({
      isoDateStr: "2020-06-01T00:00:00-03:00",
      period: "Diária",
      offset: 0,
    })
  ).toBe("2020-06-01T00:00:00-00:00");
});
