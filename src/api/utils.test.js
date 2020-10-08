import { subtractSeriesMaxDate } from "./utils";

test("subtracting by daily period", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: { SERMAXDATA: "2020-06-02T00:00:00-03:00", PERNOME: "Diária" },
      offset: 1,
    })
  ).toBe("2020-06-01T00:00:00-03:00");

  expect(
    subtractSeriesMaxDate({
      metadata: { SERMAXDATA: "2020-06-01T00:00:00-03:00", PERNOME: "Diária" },
      offset: 1,
    })
  ).toBe("2020-05-31T00:00:00-03:00");
});

test("subtracting by monthly period", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: { SERMAXDATA: "2020-06-01T00:00:00-03:00", PERNOME: "Mensal" },
      offset: 1,
    })
  ).toBe("2020-05-01T00:00:00-03:00");

  expect(
    subtractSeriesMaxDate({
      metadata: { SERMAXDATA: "2020-01-01T00:00:00-03:00", PERNOME: "Mensal" },
      offset: 1,
    })
  ).toBe("2019-12-01T00:00:00-03:00");
});

test("subtracting by quarterly period, the month must correspond to the quarter's initial month", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: {
        SERMAXDATA: "2020-06-01T00:00:00-03:00",
        PERNOME: "Trimestral",
      },
      offset: 1,
    })
  ).toBe("2020-01-01T00:00:00-03:00");

  expect(
    subtractSeriesMaxDate({
      metadata: {
        SERMAXDATA: "2020-10-01T00:00:00-03:00",
        PERNOME: "Trimestral",
      },
      offset: 1,
    })
  ).toBe("2020-07-01T00:00:00-03:00");

  expect(
    subtractSeriesMaxDate({
      metadata: {
        SERMAXDATA: "2020-10-01T00:00:00-03:00",
        PERNOME: "Trimestral",
      },
      offset: 4,
    })
  ).toBe("2019-10-01T00:00:00-03:00");
});

test("subtracting by yearly period", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: { SERMAXDATA: "2020-06-01T00:00:00-03:00", PERNOME: "Anual" },
      offset: 1,
    })
  ).toBe("2019-06-01T00:00:00-03:00");
});

test("subtracting by quadriennal period", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: {
        SERMAXDATA: "2020-06-01T00:00:00-03:00",
        PERNOME: "Quadrienal",
      },
      offset: 1,
    })
  ).toBe("2016-06-01T00:00:00-03:00");
});

test("subtracting by quinquennal period", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: {
        SERMAXDATA: "2020-06-01T00:00:00-03:00",
        PERNOME: "Quinquenal",
      },
      offset: 1,
    })
  ).toBe("2015-06-01T00:00:00-03:00");
});

test("subtracting by decennal period", () => {
  expect(
    subtractSeriesMaxDate({
      metadata: { SERMAXDATA: "2020-06-01T00:00:00-03:00", PERNOME: "Decenal" },
      offset: 1,
    })
  ).toBe("2010-06-01T00:00:00-03:00");
});
