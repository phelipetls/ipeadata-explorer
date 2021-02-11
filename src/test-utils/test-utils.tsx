import * as React from "react";
import { render, screen, RenderOptions } from "@testing-library/react";
import { theme } from "../styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MemoryRouter as Router, useLocation } from "react-router-dom";
import { MemoryRouterProps } from "react-router";
import { Location } from "history";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import DateFnsUtils from "@date-io/date-fns";

import { readFileSync, existsSync } from "fs";

export const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      retry: false,
    },
  },
});

type RouterLocationOptions = {
  renderLocation: (location: Location) => string;
};

export const RouterLocation = ({ renderLocation }: RouterLocationOptions) => {
  const location = useLocation();

  return <div data-testid="router-location">{renderLocation(location)}</div>;
};

export function getSearchParams() {
  return new URLSearchParams(
    screen.getByTestId("router-location").textContent || undefined
  );
}

type CustomRenderOptions = RouterLocationOptions & {
  routerOptions: MemoryRouterProps;
};

const customRender = (
  component: JSX.Element,
  {
    routerOptions,
    renderLocation,
    ...renderOptions
  }: Partial<CustomRenderOptions & RenderOptions> = {}
) => {
  return render(
    <ThemeProvider theme={theme}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Router {...routerOptions}>
            {component}
            {renderLocation && (
              <RouterLocation renderLocation={renderLocation} />
            )}
          </Router>
        </MuiPickersUtilsProvider>
      </ReactQueryCacheProvider>
    </ThemeProvider>,
    renderOptions
  );
};

export function readJson(path: string): object {
  if (!existsSync(path)) {
    throw new Error(`${path} does not exist`);
  }

  return JSON.parse(readFileSync(path, { encoding: "utf-8" }));
}

export * from "@testing-library/react";
export { customRender as render };
