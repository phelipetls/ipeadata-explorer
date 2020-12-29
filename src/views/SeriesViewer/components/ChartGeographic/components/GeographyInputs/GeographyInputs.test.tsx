import * as React from "react";
import { screen, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";

import { FormProvider, useForm } from "react-hook-form";
import { GeographyInputs } from "./GeographyInputs";
import { SeriesDivision } from "api/ibge";

import { render } from "test-utils";
import { server } from "test-utils/server";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));

const MOCKED_DIVISIONS: SeriesDivision[] = [
  "Brasil",
  "Área metropolitana",
  "Regiões",
  "Estados",
  "Mesorregiões",
  "Microrregiões",
  "Municípios",
];

const FormContext = ({ children }: { children: JSX.Element }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

test("if geography inputs work correctly", async () => {
  render(
    <FormContext>
      <GeographyInputs division="Brasil" divisions={MOCKED_DIVISIONS} />
    </FormContext>
  );

  // A user wants to see values per state
  const geographicDivision = await screen.findByLabelText(
    /divisões geográficas/i
  );
  userEvent.selectOptions(geographicDivision, "Estados");

  // We expect an input to select a geographic boundary to appear
  // e.g. if the user wants to see only stats from the northern region.
  const geographicBoundary = await screen.findByLabelText(/limite geográfico/i);
  userEvent.selectOptions(geographicBoundary, "Regiões");

  // A new input should appear to select a specific region
  await waitFor(() =>
    expect(screen.getByLabelText("Região")).toBeInTheDocument()
  );
});
