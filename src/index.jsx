import * as React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "fontsource-roboto";
import App from "./App";

import { theme } from "./styles/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { QueryClient, QueryClientProvider } from "react-query";

import { BrowserRouter as Router } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
