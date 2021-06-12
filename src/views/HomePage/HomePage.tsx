import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { HomePageFeatures } from "./components";

const useStyles = makeStyles((theme) => ({
  siteTitle: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
  siteDescription: {
    maxWidth: "100ch",
  },
}));

export function HomePage() {
  const classes = useStyles();

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        className={classes.siteTitle}
      >
        Explore e visualize o Ipeadata
      </Typography>

      <div className={classes.siteDescription}>
        <Typography paragraph align="center">
          O Ipeadata é uma base de dados mantida pelo Ipea que reúne séries
          temporais de diversas fontes, temas e países.
        </Typography>

        <Typography paragraph align="center">
          Este é um aplicativo escrito em React para explorar e visualizar essa
          base de dados.
        </Typography>
      </div>

      <HomePageFeatures />
    </>
  );
}

export default HomePage;
