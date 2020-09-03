import React from "react";

import { Typography, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  sectionsContainer: {
    margin: "0 auto",
    width: "75vw",
    paddingTop: "5vh"
  },
  section: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "25vh",
    cursor: "pointer"
  }
}));

const sections = {
  Bases: {},
  Temas: {},
  Países: {},
  "Níveis geográficos": {}
};

export default function LandingPageSections() {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignItems="stretch"
      spacing={2}
      className={classes.sectionsContainer}
    >
      {Object.entries(sections).map(([section, props]) => {
        return (
          <Grid xs={12} sm={6} md={3} key={section} alignItems="center" item>
            <Paper className={classes.section}>
              <Typography>{section}</Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
