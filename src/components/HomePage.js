import React from "react";

import { Link as RouterLink } from "react-router-dom";
import { Link, Grid, Paper, Typography } from "@material-ui/core";
import { BarChart, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  siteTitle: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
  siteDescription: {
    maxWidth: "100ch",
  },
  featuresSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  feature: {
    height: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(2),
    textAlign: "center",
    maxWidth: "70%",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
}));

export default function HomePage() {
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
          base de dados.{" "}
          <Link component={RouterLink} to="/sobre">
            Saiba mais sobre o projeto
          </Link>
          .
        </Typography>
      </div>

      <Grid
        container
        justify="center"
        spacing={3}
        className={classes.featuresSection}
      >
        <Grid item sm={4} xs={12} key="1">
          <Grid
            container
            direction="column"
            alignItems="center"
            component={Paper}
            className={classes.feature}
          >
            <Search fontSize="large" />

            <Typography className={classes.description}>
              Explore a base de dados com a ajuda de diversos filtros.
            </Typography>
          </Grid>
        </Grid>

        <Grid item sm={4} xs={12} key="2">
          <Grid
            container
            direction="column"
            alignItems="center"
            component={Paper}
            className={classes.feature}
          >
            <BarChart fontSize="large" />

            <Typography className={classes.description}>
              Visualize séries temporais numéricas, categóricas e com recortes
              geográficos.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
