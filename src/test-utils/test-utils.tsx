import * as React from "react";
import { render, screen, RenderOptions } from "@testing-library/react";
import { theme } from "../styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MemoryRouter as Router, useLocation } from "react-router-dom";
import { MemoryRouterProps } from "react-router";
import { Location } from "history";
import DateFnsUtils from "@date-io/date-fns";

import { readFileSync, existsSync } from "fs";

interface customRenderOptions {
  routerOptions: MemoryRouterProps;
  renderLocation: (location: Location) => string;
}

export const RouterLocation = ({
  renderLocation,
}: {
  renderLocation: (location: Location) => string;
}) => {
  const location = useLocation();

  return <div data-testid="router-location">{renderLocation(location)}</div>;
};

const customRender = (
  component: JSX.Element,
  {
    routerOptions,
    renderLocation,
    ...renderOptions
  }: Partial<customRenderOptions & RenderOptions> = {}
) => {
  return render(
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router {...routerOptions}>
          {component}
          {renderLocation && <RouterLocation renderLocation={renderLocation} />}
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>,
    renderOptions
  );
};

export function readJson(path: string): object {
  if (!existsSync(path)) {
    throw new Error(`${path} does not exist`);
  }
  const file = readFileSync(path, {
    encoding: "utf-8",
  });
  return JSON.parse(file);
}

export function getSearchParams() {
  return new URLSearchParams(
    screen.getByTestId("router-location").textContent || undefined
  );
}

export * from "@testing-library/react";
export { customRender as render };
