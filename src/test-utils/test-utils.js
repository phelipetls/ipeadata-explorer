import React from "react";
import { render } from "@testing-library/react";
import { theme } from "../styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MemoryRouter as Router } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import { readFileSync, existsSync } from "fs";

const customRender = (component, { routerOptions, ...renderOptions } = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <Router {...routerOptions}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {component}
        </MuiPickersUtilsProvider>
      </Router>
    </ThemeProvider>,
    renderOptions
  );
};

export function readJson(path) {
  if (!existsSync(path)) {
    throw new Error(`${path} does not exist`);
  }
  const file = readFileSync(path, {
    encoding: "utf-8",
  });
  return JSON.parse(file);
}

export * from "@testing-library/react";
export { customRender as render };
