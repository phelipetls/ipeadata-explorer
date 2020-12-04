import { formatDateFromDatePicker } from "./format-date-from-date-picker";

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
