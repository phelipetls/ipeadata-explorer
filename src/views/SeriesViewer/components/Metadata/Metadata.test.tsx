import * as React from "react";
import { render, readJson, screen } from "test-utils";

import { SeriesMetadata } from "types";
import { Metadata } from "./Metadata";

const MOCKED_METADATA = readJson(__dirname + "/mocks/metadata.json");

it("should show metadata correctly", () => {
  render(<Metadata metadata={MOCKED_METADATA as SeriesMetadata} />);

  screen.getByRole("heading", { name: "Taxa de juros - Over / Selic" });

  screen.getByRole("columnheader", { name: "Metadado" });
  screen.getByRole("columnheader", { name: "Valor" });

  screen.getByRole("row", { name: "Base Macroeconômico" });
  screen.getByRole("row", { name: "Periodicidade Mensal" });
  screen.getByRole("row", { name: "Início 31/12/1973" });
  screen.getByRole("row", { name: "Fim 01/11/2020" });
});
