import userEvent from "@testing-library/user-event";
import { GeographicDivision } from "api/ibge";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { render, screen, waitFor } from "test-utils";
import { server } from "test-utils/server";
import { GeographyInputs } from "./GeographyInputs";
import { handlers } from "./mocks/handlers";

beforeEach(() => server.use(...handlers));

const MOCKED_DIVISIONS: GeographicDivision[] = [
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
    expect(screen.getByLabelText(/região/i)).toBeInTheDocument()
  );
});