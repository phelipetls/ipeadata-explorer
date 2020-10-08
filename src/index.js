import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "fontsource-roboto";
import App from "./App";

import { theme } from "./styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
