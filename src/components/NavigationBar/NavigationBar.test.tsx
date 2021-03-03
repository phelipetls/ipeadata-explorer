import userEvent from "@testing-library/user-event";
import * as React from "react";
import { render, screen } from "test-utils";
import { NavigationBar } from "./NavigationBar";

test("if search bar appears and disappear when you click on back button", () => {
  render(<NavigationBar />);

  userEvent.click(screen.getByTestId("search-button"));

  const searchInput = screen.getByPlaceholderText(/pesquisar/i);
  expect(searchInput).toBeInTheDocument();

  userEvent.click(screen.getByTestId("search-back-button"));
  expect(searchInput).not.toBeInTheDocument();
});

test("if search bar appears and disappear with Escape", () => {
  render(<NavigationBar />);

  userEvent.click(screen.getByTestId("search-button"));

  const searchInput = screen.getByPlaceholderText(/pesquisar/i);
  expect(searchInput).toBeInTheDocument();

  userEvent.type(searchInput, "{esc}");
  expect(searchInput).not.toBeInTheDocument();
});
