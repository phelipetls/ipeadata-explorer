import userEvent from "@testing-library/user-event";
import * as React from "react";
import { getSearchParams, render, screen, waitFor } from "test-utils";
import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";
import { SeriesSearch } from "./SeriesSearch";

beforeEach(() => server.use(...handlers));

it("should show default results", async () => {
  render(<SeriesSearch />);

  await waitFor(() => {
    expect(
      screen.getByText("Taxa de juros - Selic - fixada pelo Copom")
    ).toBeInTheDocument();
  });
});

it("should handle pagination", async () => {
  render(<SeriesSearch />);

  await waitFor(() =>
    expect(screen.getByText("1-10 de 8874")).toBeInTheDocument()
  );

  userEvent.click(
    screen.getByRole("button", {
      name: /próxima página/i,
    })
  );

  await waitFor(() =>
    expect(screen.getByText("11-20 de 8874")).toBeInTheDocument()
  );
});

it("should update URL if state changes", async () => {
  render(<SeriesSearch />, { renderLocation: location => location.search });

  const filterButton = await screen.findByRole("button", {
    name: /expande filtros/i,
  });
  userEvent.click(filterButton);

  const seriesNameInput = await screen.findByLabelText(/nome da série/i);
  userEvent.type(seriesNameInput, "spread{enter}");

  await waitFor(() =>
    expect(getSearchParams().toString()).toBe("SERNOME=spread")
  );
});

it("should get default value from URL", async () => {
  render(<SeriesSearch />, {
    routerOptions: { initialEntries: ["?SERNOME=spread"] },
    renderLocation: location => location.search,
  });

  const filterButton = await screen.findByRole("button", {
    name: /expande filtros/i,
  });
  userEvent.click(filterButton);

  const seriesNameInput = await screen.findByLabelText(/nome da série/i);

  expect(seriesNameInput).toHaveValue("spread");
});
