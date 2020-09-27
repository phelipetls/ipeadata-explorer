import React from "react";

import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SeriesMetadataTable from "./SeriesMetadataTable";

const useStyles = makeStyles(theme => ({
  metadata: {
    padding: theme.spacing(2),
    "& > *": {
      padding: theme.spacing(2),
    },
  },
}));

export default function SeriesMetadata({ metadata }) {
  const classes = useStyles();

  return (
    <Grid container component={Paper} className={classes.metadata}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          {metadata.SERNOME}
        </Typography>
        <Typography variant="body1" paragraph>
          {metadata.SERCOMENTARIO.replace(/<[^>]+>/g, "")}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <SeriesMetadataTable metadata={metadata} />
      </Grid>
    </Grid>
  );
}
