import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { render, RenderOptions, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "fs";
import { Location } from "history";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouterProps } from "react-router";
import { MemoryRouter as Router, useLocation } from "react-router-dom";
import { theme } from "../styles/Theme";

export const queryClient = new QueryClient({
  defaultOptions: {
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
      <QueryClientProvider client={queryClient}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Router {...routerOptions}>
            {component}
            {renderLocation && (
              <RouterLocation renderLocation={renderLocation} />
            )}
          </Router>
        </MuiPickersUtilsProvider>
      </QueryClientProvider>
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
