import React from "react";
import { render, readJson, screen } from "test-utils";
import { Metadata } from "./index";

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show metadata correctly", () => {
  render(<Metadata metadata={MOCKED_METADATA} />);

  screen.getByRole("heading", { name: "Taxa de juros - Over / Selic" });

  screen.getByRole("columnheader", { name: "Metadado" });
  screen.getByRole("columnheader", { name: "Valor" });

  screen.getByRole("row", { name: "Base Macroeconômico" });
  screen.getByRole("row", { name: "Periodicidade Mensal" });
});
