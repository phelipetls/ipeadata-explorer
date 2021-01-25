import * as React from "react";
import { render, readJson, screen, getSearchParams, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";

import { Chart } from "chart.js";
import { ChartGeographic } from "./ChartGeographic";
import { SeriesMetadata } from "types";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

beforeEach(() => {
  server.use(...handlers);
});

beforeEach(() => {
  render(
    <ChartGeographic
      code="ACIDT"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />,
    { renderLocation: location => location.search }
  );
});

it("should show a line chart by default", async () => {
  await waitFor(() =>
    expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
  );

  const chart = Chart.getChart("chart-id");
  expect(chart?.config.type).toBe("line");
});

it("should show a map if geographic division is state", async () => {
  await waitFor(() =>
    expect(screen.queryByLabelText(/divis.es geogr.ficas/i)).toBeInTheDocument()
  );

  const geographicDivisionSelect = screen.getByLabelText(
    /divis.es geogr.ficas/i
  ) as HTMLSelectElement;

  // First geographic division is 'Brasil'
  expect(geographicDivisionSelect.value).toBe("Brasil");

  // Let's change it to 'Estados' (states)
  userEvent.selectOptions(geographicDivisionSelect, "Estados");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitFor(() =>
    expect(getSearchParams().get("division")).toBe("Estados")
  );

  // We expect a map now
  await waitFor(() =>
    expect(document.querySelector("svg.rsm-svg")).toBeInTheDocument()
  );
});
