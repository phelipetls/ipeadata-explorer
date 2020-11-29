import React from "react";
import userEvent from "@testing-library/user-event";
import { SeriesSearch } from "./index";
import { render, screen, waitFor } from "test-utils";
import { server } from "server";

import { handlers } from "./mocks/handlers";
beforeEach(() => server.use(...handlers));

it("should display default search results correctly", async () => {
  render(<SeriesSearch />);

  await waitFor(() => {
    expect(
      screen.getByText("Taxa de juros - Selic - fixada pelo Copom")
    ).toBeInTheDocument();
  });

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
});
