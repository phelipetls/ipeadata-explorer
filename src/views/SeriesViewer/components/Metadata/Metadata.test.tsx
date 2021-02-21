import * as React from "react";
import { render, readJson, screen } from "test-utils";

import { SeriesMetadata } from "types";
import { Metadata } from "./Metadata";

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show metadata correctly", () => {
  render(<Metadata metadata={MOCKED_METADATA as SeriesMetadata} />);

  expect(
    screen.getByRole("heading", { name: "Taxa de juros - Over / Selic" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("columnheader", { name: "Metadado" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: "Valor" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("row", { name: "Base Macroeconômico" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("row", { name: "Periodicidade Mensal" })
  ).toBeInTheDocument();
});
