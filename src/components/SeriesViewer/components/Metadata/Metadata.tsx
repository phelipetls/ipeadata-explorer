import React from "react";

import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { MetadataTable } from "components/common";
import { SeriesMetadata } from "components/types";

const useStyles = makeStyles(theme => ({
  metadata: {
    padding: theme.spacing(3),
    "& > *": {
      padding: theme.spacing(3),
    },
  },
}));

interface Props {
  metadata: SeriesMetadata,
}

export function Metadata({ metadata }: Props) {
  const classes = useStyles();

  return (
    <Grid container component={Paper} className={classes.metadata}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          {metadata.SERNOME}
        </Typography>
        <Typography variant="body1" paragraph>
          {metadata.SERCOMENTARIO
            ? metadata.SERCOMENTARIO.replace(/<[^>]+>/g, "")
            : ""}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <MetadataTable metadata={metadata} />
      </Grid>
    </Grid>
  );
}
