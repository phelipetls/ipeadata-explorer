import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Themes from "./components/Themes";
import About from "./components/About";
import Countries from "./components/Countries";
import SeriesList from "./components/SeriesList";
import SeriesViewer from "./components/SeriesViewer";

const useStyles = makeStyles(theme => ({
  app: {
    display: "flex",
    flexFlow: "column",
    minHeight: "100vh",
  },
  mainSection: {
    flex: 1,
    maxWidth: theme.breakpoints.values.md,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.app}>
        <NavigationBar />
        <Container component="main" className={classes.mainSection}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/sobre" component={About} />
            <Route path="/temas" component={Themes} />
            <Route path="/paises" component={Countries} />
            <Route path="/series" component={SeriesList} />
            <Route path="/serie/:code" component={SeriesViewer} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
