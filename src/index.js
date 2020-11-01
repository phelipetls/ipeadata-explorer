import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "fontsource-roboto";
import App from "./App";

import { theme } from "./styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { QueryCache, ReactQueryCacheProvider } from "react-query";

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <App />
        </ReactQueryCacheProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
