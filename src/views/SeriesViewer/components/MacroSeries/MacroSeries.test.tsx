import userEvent from "@testing-library/user-event";
import { Chart } from "chart.js";
import { rest } from "msw";
import * as React from "react";
import { getSearchParams, readJson, render, screen, waitFor } from "test-utils";
import { server } from "test-utils/server";
import { SeriesMetadata } from "types";
import { MacroSeries } from "./MacroSeries";
import { handlers } from "./mocks/handlers";

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

describe("successful requests", () => {
  beforeEach(() => server.use(...handlers));

  it("should show a line chart by default", async () => {
    render(
      <MacroSeries
        code="BM12_TJOVER12"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      { renderLocation: location => location.search }
    );

    await waitFor(() =>
      expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
    );

    // Expect a line chart
    const chart = Chart.getChart("chart-id");
    expect(chart?.config.type).toBe("line");
  });

  it("should correctly filter by last n values", async () => {
    render(
      <MacroSeries
        code="BM12_TJOVER12"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      { renderLocation: location => location.search }
    );

    // Getting last 5 values
    userEvent.clear(screen.getByLabelText(/últimos n/i));
    userEvent.type(screen.getByLabelText(/últimos n/i), "5");
    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() =>
      expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
    );

    const chart = Chart.getChart("chart-id");
    expect(chart?.data.labels.length).toBe(5);
  });

  it("should correctly filter with date interval", async () => {
    render(
      <MacroSeries
        code="BM12_TJOVER12"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      { renderLocation: location => location.search }
    );

    // Getting values from 01/01/2019 to 01/01/2020
    userEvent.type(screen.getByLabelText(/data inicial/i), "01/01/2019");
    userEvent.type(screen.getByLabelText(/data final/i), "01/01/2020");
    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() =>
      expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
    );

    const chart = Chart.getChart("chart-id");

    const chartLabels = chart?.data?.labels;
    expect(chartLabels![chartLabels!.length - 1]).toMatch(/^2019-01-01/);
    expect(chartLabels![0]).toMatch(/^2020-01-01/);
  });

  it("should update URL if state changes", async () => {
    render(
      <MacroSeries
        code="BM12_TJOVER12"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      { renderLocation: location => location.search }
    );

    userEvent.clear(screen.getByLabelText(/últimos n/i));
    userEvent.type(screen.getByLabelText(/últimos n/i), "5");
    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => expect(getSearchParams().toString()).toBe("lastN=5"));
  });

  it("should get default value from URL", async () => {
    render(
      <MacroSeries
        code="BM12_TJOVER12"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      {
        routerOptions: {
          initialEntries: ["?startDate=01/01/2019&endDate=01/01/2020"],
        },
        renderLocation: location => location.search,
      }
    );

    expect(screen.queryByLabelText(/data inicial/i)).toHaveValue("01/01/2019");
    expect(screen.getByLabelText(/data final/i)).toHaveValue("01/01/2020");

    // Test default values and values from URL
    expect(screen.getByLabelText(/últimos n/i)).toHaveValue(50);
  });
});

test("error handling", async () => {
  server.use(
    rest.get(/Metadados.*Valores/, (_, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(
    <MacroSeries
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />
  );

  await waitFor(() =>
    expect(
      screen.getByText("Desculpe, ocorreu um erro inesperado")
    ).toBeInTheDocument()
  );
});

test("empty state", async () => {
  server.use(
    rest.get(/Metadados.*Valores/, (_, res, ctx) => {
      return res(ctx.status(200), ctx.json({ value: [] }));
    })
  );

  render(
    <MacroSeries
      code="BM12_TJOVER12"
      metadata={MOCKED_METADATA as SeriesMetadata}
    />
  );

  await waitFor(() =>
    expect(screen.getByText("Sem dados")).toBeInTheDocument()
  );
});
