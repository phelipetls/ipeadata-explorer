import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GeographyInputs } from "./GeographyInputs";
import { server } from "test-utils";
import { handlers } from "./mocks/handlers";
import { seriesDivisionType } from "api/ibge";

beforeEach(() => server.use(...handlers));

const MOCKED_DIVISIONS: seriesDivisionType[] = [
  "Brasil",
  "Área metropolitana",
  "Regiões",
  "Estados",
  "Mesorregiões",
  "Microrregiões",
  "Municípios",
];

test("if geography inputs work correctly", async () => {
  render(<GeographyInputs division="Brasil" divisions={MOCKED_DIVISIONS} />);

  // A user wants to see values per states
  const geographicDivision = await screen.findByLabelText(
    /divisões geográficas/i
  );
  userEvent.selectOptions(geographicDivision, "Estados");

  // We expect an input for geographic boundary to appear, e.g. if the user
  // wants to see states withing the northern region only.
  const geographicBoundary = await screen.findByLabelText(/limite geográfico/i);
  userEvent.selectOptions(geographicBoundary, "Regiões");

  // A new input should appear to select a specific geographic boundary (south
  // region, northern region etc.)
  await screen.findByLabelText("Região");
});
