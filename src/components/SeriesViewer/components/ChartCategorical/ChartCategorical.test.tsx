import React from "react";
import {
  render,
  readJson,
  screen,
  waitForElementToBeRemoved,
} from "test-utils";
import { server } from "test-utils";
import { SeriesMetadata } from "components/types";

import { Chart } from "chart.js";
import { ChartCategorical } from "./ChartCategorical";

import { handlers } from "./mocks/handlers";
beforeEach(() => server.use(...handlers));

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json") as SeriesMetadata;

it("should show and filter categorical data correctly", async () => {
  render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />);

  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Expect a bar chart
  const chart = Chart.getChart("chart-id");
  expect(chart?.config.type).toBe("bar");
});
