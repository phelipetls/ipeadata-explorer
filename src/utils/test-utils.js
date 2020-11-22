import React from "react";

import { render } from "@testing-library/react";

import { theme } from "../styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { MemoryRouter as Router } from "react-router-dom";

const customRender = component => {
  return render(
    <ThemeProvider theme={theme}>
      <Router>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {component}
        </MuiPickersUtilsProvider>
      </Router>
    </ThemeProvider>
  );
};

export * from "@testing-library/react";

export { customRender as render };
