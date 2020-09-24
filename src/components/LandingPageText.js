import React from "react";

import { Grid, Paper, Typography } from "@material-ui/core";
import { BarChart, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  landingPageText: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
  featuresSection: {
    marginTop: theme.spacing(4),
  },
  feature: {
    minHeight: "25vh",
  },
  icon: {
    marginTop: theme.spacing(2),
  },
  description: {
    textAlign: "center",
    maxWidth: "70%",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
}));

export default function LandingPageText() {
  const classes = useStyles();

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        className={classes.landingPageText}
      >
        Explore e visualize os dados do Ipeadata
      </Typography>
      <Typography paragraph align="center">
        O Ipeadata é uma base de dados mantida pelo Ipea que reúne séries
        temporais de diversas fontes, temas e países.
      </Typography>

      <Grid
        container
        justify="space-around"
        spacing={2}
        className={classes.featuresSection}
      >
        <Grid
          container
          direction="column"
          item
          sm={4}
          xs={12}
          component={Paper}
          alignItems="center"
          className={classes.feature}
        >
          <Search fontSize="large" className={classes.icon} />

          <Typography className={classes.description}>
            Explore a base de dados com a ajuda de diversos filtros.
          </Typography>
        </Grid>

        <Grid
          container
          direction="column"
          item
          sm={4}
          xs={12}
          component={Paper}
          alignItems="center"
          className={classes.feature}
        >
          <BarChart fontSize="large" className={classes.icon} />
          <Typography className={classes.description}>
            Visualize séries temporais numéricas, categóricas e com recortes
            geográficos.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
