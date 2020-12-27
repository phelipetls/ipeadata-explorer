import * as React from "react";
import userEvent from "@testing-library/user-event";
import { Chart } from "chart.js";
import {
  render,
  readJson,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from "test-utils";
import { ChartGeographic } from "./ChartGeographic";
import { SeriesMetadata } from "components/types";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));
const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show and filter geographic data correctly", async () => {
  render(
    <ChartGeographic
      code="ACIDT"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />
  );

  await waitForElementToBeRemoved(() => screen.queryAllByRole("progressbar"));

  const chart = Chart.getChart("chart-id");
  expect(chart?.config.type).toBe("line");

  // Select "Estados" (states) as geographic division
  const geographicDivision = await screen.findByLabelText(
    /divisões geográficas/i
  );
  userEvent.selectOptions(geographicDivision, "Estados");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitForElementToBeRemoved(() => screen.queryByTestId("chart-id"));
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  // Expect a svg now
  expect(document.querySelector("svg.rsm-svg")).toBeInTheDocument();
});
