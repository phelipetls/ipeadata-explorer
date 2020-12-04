import { offsetDateByPeriod, formatDateFromDatePicker } from "./date-utils";

describe("test offsetDateByPeriod", () => {
  test("subtracting by daily period", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-02T00:00:00-03:00",
        period: "Diária",
        offset: 1,
      })
    ).toBe("2020-06-01T00:00:00Z");

    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Diária",
        offset: 1,
      })
    ).toBe("2020-05-31T00:00:00Z");
  });

  test("subtracting by monthly period", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Mensal",
        offset: 1,
      })
    ).toBe("2020-05-01T00:00:00Z");

    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-01-01T00:00:00-03:00",
        period: "Mensal",
        offset: 1,
      })
    ).toBe("2019-12-01T00:00:00Z");
  });

  test("subtracting by quarterly period, the month must correspond to the quarter's initial month", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Trimestral",
        offset: 1,
      })
    ).toBe("2020-01-01T00:00:00Z");

    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-10-01T00:00:00-03:00",
        period: "Trimestral",
        offset: 1,
      })
    ).toBe("2020-07-01T00:00:00Z");

    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-10-01T00:00:00-03:00",
        period: "Trimestral",
        offset: 4,
      })
    ).toBe("2019-10-01T00:00:00Z");
  });

  test("subtracting by yearly period", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Anual",
        offset: 1,
      })
    ).toBe("2019-06-01T00:00:00Z");
  });

  test("subtracting by quadriennal period", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Quadrienal",
        offset: 1,
      })
    ).toBe("2016-06-01T00:00:00Z");
  });

  test("subtracting by quinquennal period", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Quinquenal",
        offset: 1,
      })
    ).toBe("2015-06-01T00:00:00Z");
  });

  test("subtracting by decennal period", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Decenal",
        offset: 1,
      })
    ).toBe("2010-06-01T00:00:00Z");
  });

  test("subtracting date from irregular periodicity", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "1907-01-01T00:00:00-03:00",
        period: "Irregular",
        offset: 1,
      })
    ).toBe("1907-01-01T00:00:00Z");
  });

  test("subtracting problematic timezone offset", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "1907-01-01T00:00:00-02:00",
        period: "Irregular",
        offset: 1,
      })
    ).toBe("1907-01-01T00:00:00Z");
  });

  test("subtracting with a 0 offset does not change the date", () => {
    expect(
      offsetDateByPeriod({
        isoDateStr: "2020-06-01T00:00:00-03:00",
        period: "Diária",
        offset: 0,
      })
    ).toBe("2020-06-01T00:00:00Z");
  });
});

describe("test formatDateFromDatePicker", () => {
  test("format date from date picker (start date)", () => {
    expect(formatDateFromDatePicker("01/01/2019")).toBe("2019-01-01T00:00:00Z");
  });

  test("format date from date picker (end date)", () => {
    expect(formatDateFromDatePicker("01/01/2019", { isEndDate: true })).toBe(
      "2019-01-01T00:00:00-03:00"
    );
  });
});
