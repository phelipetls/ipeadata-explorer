import * as React from "react";
import userEvent from "@testing-library/user-event";
import { getSearchParams, render, screen, waitFor } from "test-utils";

import { SeriesSearch } from "./SeriesSearch";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));

test("if default search results are displayed", async () => {
  render(<SeriesSearch />);

  await waitFor(() => {
    expect(
      screen.getByText("Taxa de juros - Selic - fixada pelo Copom")
    ).toBeInTheDocument();
  });

  expect(screen.getByText("1-10 de 8871")).toBeInTheDocument();
});

test("if search filter and pagination works", async () => {
  render(<SeriesSearch />);

  // Simulate searching for word 'spread'
  const filterButton = await screen.findByRole("button", {
    name: /expande filtros/i,
  });
  userEvent.click(filterButton);

  const seriesNameInput = await screen.findByLabelText(/nome da série/i);
  userEvent.type(seriesNameInput, "spread{enter}");

  // Test first page content
  await waitFor(() =>
    expect(
      screen.getByText("Operações de crédito - recursos direcionados - spread")
    ).toBeInTheDocument()
  );

  expect(screen.getByText("1-10 de 16")).toBeInTheDocument();

  const nextPageButton = screen.getByRole("button", {
    name: /próxima página/i,
  });
  userEvent.click(nextPageButton);

  // Test second page content
  await waitFor(() =>
    expect(
      screen.getByText("Bônus global República (24) - spread")
    ).toBeInTheDocument()
  );

  expect(screen.getByText("11-16 de 16")).toBeInTheDocument();
});

test("if search state is in sync with url", async () => {
  render(<SeriesSearch />, { renderLocation: location => location.search });

  expect(getSearchParams().get("page")).toBe("0");
  expect(getSearchParams().get("rowsPerPage")).toBe("10");

  const expandFiltersRole = await screen.findByRole("button", {
    name: /expande filtros/i,
  });
  userEvent.click(expandFiltersRole);

  const seriesNameInput = await screen.findByLabelText(/nome da série/i);
  userEvent.type(seriesNameInput, "spread{enter}");

  await waitFor(() => expect(getSearchParams().get("SERNOME")).toBe("spread"));
});
