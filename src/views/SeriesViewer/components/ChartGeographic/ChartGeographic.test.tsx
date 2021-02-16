import * as React from "react";
import { render, readJson, screen, getSearchParams, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";

import { Chart } from "chart.js";
import { ChartGeographic } from "./ChartGeographic";
import { SeriesMetadata } from "types";

import { rest } from "msw";
import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

describe("succesful requests", () => {
  beforeEach(() => {
    server.use(...handlers);
  });

  it("should show a line chart by default", async () => {
    render(
      <ChartGeographic
        code="ACIDT"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      { renderLocation: location => location.search }
    );

    await waitFor(() =>
      expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
    );

    const chart = Chart.getChart("chart-id");
    expect(chart?.config.type).toBe("line");
  });

  // FIXME: this triggers a
  // 'Warning: Can't perform a React state update on an unmounted component. (...)'
  // for unknown reason to me
  it("should show a map if geographic division is state", async () => {
    render(
      <ChartGeographic
        code="ACIDT"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      { renderLocation: location => location.search }
    );

    await waitFor(() =>
      expect(
        screen.queryByLabelText(/divis.es geogr.ficas/i)
      ).toBeInTheDocument()
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
      expect(document.querySelector("svg.rsm-svg")).toBeInTheDocument()
    );

    expect(getSearchParams().get("division")).toBe("Estados");
    expect(document.querySelector("svg.rsm-svg")).toBeInTheDocument();

    expect(screen.queryByText("NaN")).not.toBeInTheDocument();
  });

  it("should be able to generate map from url parameters", async () => {
    const searchParams = new URLSearchParams();

    searchParams.set("division", "Estados");
    searchParams.set("boundaryDivision", "Regiões");
    // 1 is the IBGE code for Brazil's northern region
    searchParams.set("boundaryId", "1");

    render(
      <ChartGeographic
        code="ACIDT"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />,
      {
        routerOptions: {
          initialEntries: [`/serie/ACIDT?${searchParams}`],
        },
        renderLocation: location => location.search,
      }
    );

    const selectDivision = (await screen.findByLabelText(
      /divis.es geogr.ficas/i
    )) as HTMLSelectElement;

    expect(selectDivision.value).toBe("Estados");

    const selectBoundaryDivision = (await screen.findByLabelText(
      /limite geogr.fico/i
    )) as HTMLSelectElement;

    expect(selectBoundaryDivision.value).toBe("Regiões");

    const selectBoundaryId = (await screen.findByLabelText(
      /regi.o/i
    )) as HTMLSelectElement;

    expect(selectBoundaryId.selectedOptions[0].textContent).toBe("Norte");

    await waitFor(() =>
      expect(document.querySelector("svg.rsm-svg")).toBeInTheDocument()
    );

    expect(getSearchParams().toString()).toBe(
      encodeURI("division=Estados&boundaryDivision=Regiões&boundaryId=1")
    );

    // Change division to be only 'Brasil'
    userEvent.selectOptions(selectDivision, "Brasil");

    await waitFor(() =>
      expect(screen.queryByLabelText(/regi.o/i)).not.toBeInTheDocument()
    );

    userEvent.click(screen.getByRole("button", { name: /filtrar/i }));

    // Except line chart to show up
    await waitFor(() =>
      expect(screen.queryByTestId("chart-id")).toBeInTheDocument()
    );

    // And search parameters to change
    expect(getSearchParams().toString()).toBe(encodeURI("division=Brasil"));
  });
});

describe("error handling/empty state", () => {
  it("should show an error message", async () => {
    server.use(
      rest.get(/Metadados.*\/Valores/, (req, res, ctx) => {
        // First request is made to fetch geographic divisions and should be
        // successful
        if (req.url.searchParams.get("$apply")) {
          return res(
            ctx.status(200),
            ctx.json(readJson(__dirname + "/mocks/geographic-divisions.json"))
          );
        }

        // Subsequent requests are meant to fetch data for charts
        return res(ctx.status(500));
      })
    );

    render(
      <ChartGeographic
        code="ACIDT"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />
    );

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

    render(
      <ChartGeographic
        code="ACIDT"
        metadata={MOCKED_METADATA as SeriesMetadata}
      />
    );

    await waitFor(() =>
      expect(screen.getByText("Sem dados")).toBeInTheDocument()
    );
  });
});
