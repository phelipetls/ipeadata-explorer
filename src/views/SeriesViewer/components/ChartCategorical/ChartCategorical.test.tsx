import * as React from "react";
import { render, readJson, screen, waitFor, getSearchParams } from "test-utils";

import { Chart } from "chart.js";
import { ChartCategorical } from "./ChartCategorical";
import { SeriesMetadata } from "types";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";
import userEvent from "@testing-library/user-event";

const MOCKED_METADATA = readJson(
  __dirname + "/mocks/metadata.json"
) as SeriesMetadata;

beforeEach(() => server.use(...handlers));

it("should show a bar chart by default", async () => {
  render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />);

  await waitFor(() =>
    expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
  );

  // Expect a bar chart
  const chart = Chart.getChart("chart-id");
  expect(chart?.config.type).toBe("bar");
});

it("should have state in sync with URL", async () => {
  render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />, {
    routerOptions: { initialEntries: ["/serie/F1PT1?lastN=5"] },
    renderLocation: location => location.search,
  });

  const lastNInput = screen.getByLabelText(/.ltimos n/i) as HTMLInputElement;

  expect(lastNInput.value).toBe("5");

  userEvent.clear(lastNInput);
  userEvent.type(lastNInput, "10");
  userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

  await waitFor(() => expect(getSearchParams().get("lastN")).toBe("10"));
});
