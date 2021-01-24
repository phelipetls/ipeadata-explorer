import * as React from "react";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  getSearchParams,
  readJson,
  waitFor,
} from "test-utils";

import { Chart } from "chart.js";
import { ChartMacro } from "./ChartMacro";
import { SeriesMetadata } from "types";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show a line chart by default", async () => {
  render(
    <ChartMacro
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />,
    { renderLocation: location => location.search }
  );

  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Expect a line chart
  const chart = Chart.getChart("chart-id");
  expect(chart?.config.type).toBe("line");
})

it("should correctly filter by last n values", async () => {
  render(
    <ChartMacro
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />,
    { renderLocation: location => location.search }
  );

  // Getting last 5 values
  userEvent.clear(screen.getByLabelText("Últimos N"));
  userEvent.type(screen.getByLabelText("Últimos N"), "5");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitForElementToBeRemoved(() => screen.queryByTestId("chart-id"));
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  const chart = Chart.getChart("chart-id");
  expect(chart?.data.labels.length).toBe(5);
})

it("should correctly filter by start and end date", async () => {
  render(
    <ChartMacro
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />,
    { renderLocation: location => location.search }
  );

  // Getting values from 01/01/2019 to 01/01/2020
  userEvent.type(screen.getByLabelText("Data inicial"), "01/01/2019");
  userEvent.type(screen.getByLabelText("Data final"), "01/01/2020");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitForElementToBeRemoved(() => screen.queryByTestId("chart-id"));
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  const chart = Chart.getChart("chart-id");
  // FIXME: this is counter-intuitive and probably not needed
  expect(chart?.data.labels.slice(-1)[0]).toMatch(/^2019-01-01/);
  expect(chart?.data.labels[0]).toMatch(/^2020-01-01/);
});

it("should get state from URL query string", async () => {
  render(
    <ChartMacro
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />,
    {
      routerOptions: {
        initialEntries: [
          "/serie/BM12_TJOVER12?startDate=01/01/2016&endDate=01/01/2018",
        ],
      },
      renderLocation: location => location.search
    }
  );

  // Test default values and values from URL
  expect(screen.getByLabelText("Últimos N")).toHaveValue(50)
  expect(screen.queryByLabelText("Data inicial")).toHaveValue("01/01/2016")
  expect(screen.getByLabelText("Data final")).toHaveValue("01/01/2018")

  // Change input data
  userEvent.clear(screen.getByLabelText("Últimos N"))
  userEvent.type(screen.getByLabelText("Últimos N"), "5{enter}")

  // Except search params to change
  await waitFor(() => expect(getSearchParams().get("lastN")).toBe("5"));
});
