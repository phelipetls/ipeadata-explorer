import React from "react";
import {
  render,
  readJson,
  screen,
  waitForElementToBeRemoved,
} from "test-utils";
import { server } from "server";
import { Chart } from "chart.js";
import { ChartCategorical } from "./index";

import { handlers } from "./mocks/handlers";
beforeEach(() => server.use(...handlers));

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show and filter categorical data correctly", async () => {
  render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />);

  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Expect a bar chart
  const chart = Chart.getChart("chart-id");
  expect(chart.config.type).toBe("bar");
});
