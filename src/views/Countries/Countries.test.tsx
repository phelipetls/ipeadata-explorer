import * as React from "react";
import { render, screen, waitForElementToBeRemoved } from "test-utils";
import { server } from "test-utils/server";
import { Countries } from "./Countries";
import { rest } from "msw";

it("should show results correctly", async () => {
  server.use(
    rest.get(/Paises/, (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          value: [
            {
              PAICODIGO: "AFG",
              PAINOME: "Afeganistão",
              "Metadados@odata.count": 1,
            },
            {
              PAICODIGO: "ZAF",
              PAINOME: "África do Sul",
              "Metadados@odata.count": 5,
            },
          ],
        })
      );
    })
  );

  render(<Countries />);

  await waitForElementToBeRemoved(() =>
    screen.queryAllByTestId("row-skeleton")
  );

  expect(screen.getByText(/afeganistão/i)).toBeInTheDocument();
  expect(screen.getByText(/áfrica do sul/i)).toBeInTheDocument();
});
