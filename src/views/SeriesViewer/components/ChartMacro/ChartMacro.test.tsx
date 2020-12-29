import * as React from "react";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  readJson,
} from "test-utils";

import { Chart } from "chart.js";
import { ChartMacro } from "./ChartMacro";
import { SeriesMetadata } from "types";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show and filter macroeconomic data correctly", async () => {
  render(
    <ChartMacro
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />
  );

  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Expect a line chart
  let chart = Chart.getChart("chart-id");
  expect(chart?.config.type).toBe("line");

  // Getting last 5 values
  userEvent.type(screen.getByLabelText("Últimos N"), "5");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitForElementToBeRemoved(() => screen.queryByTestId("chart-id"));
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  chart = Chart.getChart("chart-id");
  expect(chart?.data.labels.length).toBe(5);

  // Getting values from 01/01/2019 to 01/01/2020
  userEvent.type(screen.getByLabelText("Data inicial"), "01/01/2019");
  userEvent.type(screen.getByLabelText("Data final"), "01/01/2020");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitForElementToBeRemoved(() => screen.queryByTestId("chart-id"));
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  chart = Chart.getChart("chart-id");
  // FIXME: this is counter-intuitive and probably not needed
  expect(chart?.data.labels.slice(-1)[0]).toMatch(/^2019-01-01/);
  expect(chart?.data.labels[0]).toMatch(/^2020-01-01/);
});
