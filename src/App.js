import React from "react";
import "./App.css";

import {
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NavigationBar from "./components/NavigationBar";

import LandingPageText from "./components/LandingPageText";
import LandingPageSections from "./components/LandingPageSections";
import LandingPageSearchBar from "./components/LandingPageSearchBar";

const useStyles = makeStyles(theme => ({
  mainSection: {},
}));

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <NavigationBar />
      <Container component="main" className={classes.mainSection}>
        <LandingPageText />
        <LandingPageSearchBar />
        <LandingPageSections />
      </Container>
    </div>
  );
}

export default App;
