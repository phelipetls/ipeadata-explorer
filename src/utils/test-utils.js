import React from "react";

import { render } from "@testing-library/react";

import { theme } from "../styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { MemoryRouter as Router } from "react-router-dom";

import App from "../App";

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

export * from "@testing-library/react";

export { customRender as render };

export { App };
