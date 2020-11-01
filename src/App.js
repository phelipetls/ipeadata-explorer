import React, { Suspense } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { NavigationBar } from "./components/NavigationBar";
import { Footer } from "./components/Footer";
import { Loading } from "./components/Loading";
import { ErrorBoundary } from "./components/ErrorBoundary";

const HomePage = React.lazy(() => import("./components/HomePage"));
const About = React.lazy(() => import("./components/About"));
const Themes = React.lazy(() => import("./components/Themes"));
const Countries = React.lazy(() => import("./components/Countries"));
const SeriesSearch = React.lazy(() => import("./components/SeriesSearch"));
const SeriesViewer = React.lazy(() => import("./components/SeriesViewer"));

const useStyles = makeStyles(theme => ({
  app: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
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
          <Suspense fallback={<Loading />}>
            <Switch>
              <ErrorBoundary>
                <Route exact path="/" component={HomePage} />
                <Route path="/sobre" component={About} />
                <Route path="/temas" component={Themes} />
                <Route path="/paises" component={Countries} />
                <Route path="/series" component={SeriesSearch} />
                <Route path="/serie/:code" component={SeriesViewer} />
              </ErrorBoundary>
            </Switch>
          </Suspense>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
