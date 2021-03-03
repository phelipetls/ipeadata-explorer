import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ErrorBoundary, Footer, Loading, NavigationBar } from "components";
import * as React from "react";
import { Route, Switch } from "react-router-dom";

const HomePage = React.lazy(() => import("./views/HomePage"));
const Themes = React.lazy(() => import("./views/Themes"));
const Countries = React.lazy(() => import("./views/Countries"));
const SeriesSearch = React.lazy(() => import("./views/SeriesSearch"));
const SeriesViewer = React.lazy(() => import("./views/SeriesViewer"));

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

export function App() {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <NavigationBar />
      <Container component="main" className={classes.mainSection}>
        <React.Suspense fallback={<Loading />}>
          <Switch>
            <ErrorBoundary>
              <Route exact path="/" component={HomePage} />
              <Route path="/temas" component={Themes} />
              <Route path="/paises" component={Countries} />
              <Route path="/series" component={SeriesSearch} />
              <Route path="/serie/:code" component={SeriesViewer} />
            </ErrorBoundary>
          </Switch>
        </React.Suspense>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
