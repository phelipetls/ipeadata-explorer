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

  it("should have state in sync with URL", async () => {
    render(<ChartCategorical code="F1PT1" metadata={MOCKED_METADATA} />, {
      routerOptions: { initialEntries: ["/serie/F1PT1?lastN=5"] },
      renderLocation: location => location.search,
    });

    const lastNInput = screen.getByLabelText(/.ltimos n/i) as HTMLInputElement;

    expect(lastNInput.value).toBe("5");

    // Change to non default value
    userEvent.clear(lastNInput);
    userEvent.type(lastNInput, "10");

    const startDate = screen.getByLabelText(/data inicial/i);
    userEvent.type(startDate, "01/01/2021");

    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => expect(getSearchParams().get("lastN")).toBe("10"));
    expect(getSearchParams().get("startDate")).toBe("01/01/2021");

    // A cleared input should assume its default value and do not appear in URL
    userEvent.clear(lastNInput);
    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => expect(getSearchParams().get("lastN")).toBeNull());
  });
});

describe("error handling/empty state", () => {
  it("should show an error message", async () => {
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

  it("should show there is no data", async () => {
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
});
