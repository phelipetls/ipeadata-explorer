import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NavigationBar from "./components/NavigationBar";
import LandingPage from "./components/LandingPage";
import Themes from "./components/Themes";

const useStyles = makeStyles(theme => ({
  mainSection: {
  }
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Container component="main" className={classes.mainSection}>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/temas">
            <Themes />
          </Route>
        </Container>
      </div>
    </Router>
  );
}

export default App;
