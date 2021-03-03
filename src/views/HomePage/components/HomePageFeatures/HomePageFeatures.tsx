import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BarChart, Search } from "@material-ui/icons";
import * as React from "react";

const useStyles = makeStyles(theme => ({
  featuresSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  feature: {
    height: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  featureDescription: {
    marginTop: theme.spacing(2),
    textAlign: "center",
    maxWidth: "70%",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
}));

export function HomePageFeatures() {
  const classes = useStyles();

  return (
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

          <Typography className={classes.featureDescription}>
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

          <Typography className={classes.featureDescription}>
            Visualize séries temporais numéricas, categóricas e com recortes
            geográficos.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
