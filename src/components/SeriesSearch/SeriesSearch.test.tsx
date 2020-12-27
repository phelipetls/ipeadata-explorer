import * as React from "react";
import userEvent from "@testing-library/user-event";
import { SeriesSearch } from "./SeriesSearch";
import { render, screen, waitFor } from "test-utils";
import { server } from "test-utils/server";

// This usually times out when all tests run
jest.setTimeout(7000);

import { handlers } from "./mocks/handlers";
beforeEach(() => server.use(...handlers));

it("should display default search results correctly", async () => {
  render(<SeriesSearch />);

  await waitFor(() => {
    expect(
      screen.getByText("Taxa de juros - Selic - fixada pelo Copom")
    ).toBeInTheDocument();
  });

  expect(screen.getByText("1-10 de 8871")).toBeInTheDocument();

  // Open filters
  const expandFiltersRole = await screen.findByRole("button", {
    name: /expande filtros/i,
  });
  userEvent.click(expandFiltersRole);

  // Search for "spread"
  const seriesNameInput = await screen.findByLabelText(/nome da série/i);
  userEvent.type(seriesNameInput, "spread");

  // Submit the form
  const submitButton = await screen.findByRole("button", {
    name: /pesquisar/i,
  });
  userEvent.click(submitButton);

  // Expect a corresponding result
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

  await waitFor(() =>
    expect(
      screen.getByText("Bônus global República (24) - spread")
    ).toBeInTheDocument()
  );
  expect(screen.getByText("11-16 de 16")).toBeInTheDocument();
});
