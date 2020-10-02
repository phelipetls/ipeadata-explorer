import { subtractDateByPeriod } from "./utils";

test("subtracting by daily period", () => {
  expect(
    subtractDateByPeriod({
      date: "2020-06-02T00:00:00-03:00",
      period: "Diária",
      offset: 1,
    })
  ).toBe("2020-06-01T00:00:00-03:00");

  expect(
    subtractDateByPeriod({
      date: "2020-06-01T00:00:00-03:00",
      period: "Diária",
      offset: 1,
    })
  ).toBe("2020-05-31T00:00:00-03:00");
});

test("subtracting by monthly period", () => {
  expect(
    subtractDateByPeriod({
      period: "Mensal",
      date: "2020-06-01T00:00:00-03:00",
      offset: 1,
    })
  ).toBe("2020-05-01T00:00:00-03:00");

  expect(
    subtractDateByPeriod({
      date: "2020-01-01T00:00:00-03:00",
      period: "Mensal",
      offset: 1,
    })
  ).toBe("2019-12-01T00:00:00-03:00");
});

test("subtracting by quarterly period, the month must correspond to the quarter's initial month", () => {
  expect(
    subtractDateByPeriod({
      date: "2020-06-01T00:00:00-03:00",
      period: "Trimestral",
      offset: 1,
    })
  ).toBe("2020-01-01T00:00:00-03:00");

  expect(
    subtractDateByPeriod({
      date: "2020-10-01T00:00:00-03:00",
      period: "Trimestral",
      offset: 1,
    })
  ).toBe("2020-07-01T00:00:00-03:00");

  expect(
    subtractDateByPeriod({
      date: "2020-10-01T00:00:00-03:00",
      period: "Trimestral",
      offset: 4,
    })
  ).toBe("2019-10-01T00:00:00-03:00");
});

test("subtracting by yearly period", () => {
  expect(
    subtractDateByPeriod({
      date: "2020-06-01T00:00:00-03:00",
      period: "Anual",
      offset: 1,
    })
  ).toBe("2019-06-01T00:00:00-03:00");
});

test("subtracting by quadriennal period", () => {
  expect(
    subtractDateByPeriod({
      date: "2020-06-01T00:00:00-03:00",
      period: "Quadrienal",
      offset: 1,
    })
  ).toBe("2016-06-01T00:00:00-03:00");
});

test("subtracting by quinquennal period", () => {
  expect(
    subtractDateByPeriod({
      date: "2020-06-01T00:00:00-03:00",
      period: "Quinquenal",
      offset: 1,
    })
  ).toBe("2015-06-01T00:00:00-03:00");
});

test("subtracting by decennal period", () => {
  expect(
    subtractDateByPeriod({
      date: "2020-06-01T00:00:00-03:00",
      period: "Decenal",
      offset: 1,
    })
  ).toBe("2010-06-01T00:00:00-03:00");
});
