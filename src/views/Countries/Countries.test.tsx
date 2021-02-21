import * as React from "react";
import { render, screen, waitForElementToBeRemoved } from "test-utils";
import userEvent from "@testing-library/user-event";

import { Countries } from "./Countries";

import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));

it("should show default results", async () => {
  render(<Countries />);

  await waitForElementToBeRemoved(() =>
    screen.queryAllByTestId("row-skeleton")
  );

  expect(screen.getByText(/afeganistão/i)).toBeInTheDocument();
  expect(screen.getByText(/áfrica do sul/i)).toBeInTheDocument();
});

it("should sort rows when user clicks on header", async () => {
  render(<Countries />);

  await waitForElementToBeRemoved(() =>
    screen.queryAllByTestId("row-skeleton")
  );

  const table = screen.getByRole("table") as HTMLTableElement;

  expect(table.rows[1]).toHaveTextContent(/afeganistão/i);
  expect(table.rows[2]).toHaveTextContent(/áfrica do sul/i);

  userEvent.click(screen.getByRole("columnheader", { name: "País" }));

  expect(table.rows[2]).toHaveTextContent(/áfrica do sul/i);
  expect(table.rows[1]).toHaveTextContent(/afeganistão/i);
});
