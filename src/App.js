import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NavigationBar from "./components/NavigationBar";
import LandingPage from "./components/LandingPage";
import Themes from "./components/Themes";
import Countries from "./components/Countries";
import SeriesList from "./components/SeriesList";
import SeriesViewer from "./components/SeriesViewer";

const useStyles = makeStyles(theme => ({
  mainSection: {
    maxWidth: theme.breakpoints.values.md,
    marginTop: "2em"
  }
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Container component="main" className={classes.mainSection}>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/temas" component={Themes} />
            <Route path="/paises" component={Countries} />
            <Route path="/series" component={SeriesList} />
            <Route path="/serie/:code" component={SeriesViewer} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
