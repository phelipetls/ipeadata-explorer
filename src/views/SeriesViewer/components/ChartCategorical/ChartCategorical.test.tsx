import * as React from "react";
import { render, readJson, screen, waitFor, getSearchParams } from "test-utils";

import { Chart } from "chart.js";
import { ChartCategorical } from "./ChartCategorical";
import { SeriesMetadata } from "types";

import { rest } from "msw";
import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";
import userEvent from "@testing-library/user-event";

const MOCKED_METADATA = readJson(
  __dirname + "/mocks/metadata.json"
) as SeriesMetadata;

beforeEach(() => server.use(...handlers));

describe("successful requests", () => {
  it("should show a bar chart by default", async () => {
    render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />);

    await waitFor(() =>
      expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
    );

    // Expect a bar chart
    const chart = Chart.getChart("chart-id");
    expect(chart?.config.type).toBe("bar");
  });

  it("should update URL if state changes", async () => {
    render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />, {
      renderLocation: location => location.search,
    });

    const lastNInput = screen.getByLabelText(/últimos n/i) as HTMLInputElement;
    userEvent.clear(lastNInput);
    userEvent.type(lastNInput, "10");

    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => expect(getSearchParams().get("lastN")).toBe("10"));
  });

  it("should get default value from URL", async () => {
    render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />, {
      routerOptions: { initialEntries: ["?lastN=10"] },
      renderLocation: location => location.search,
    });

    const lastNInput = screen.getByLabelText(/últimos n/i) as HTMLInputElement;

    expect(lastNInput.value).toBe("10");
  });
});

test("error handling", async () => {
  server.use(
    rest.get(/Metadados.*Valores/, (_, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />);

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

  render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />);

  await waitFor(() =>
    expect(screen.getByText("Sem dados")).toBeInTheDocument()
  );
});
