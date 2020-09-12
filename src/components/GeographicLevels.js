import React from "react";

import { Card, Typography, Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-around"
  },
  card: {
    textAlign: "center",
    flex: "0 30%",
    minHeight: "20vh",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textDecoration: "none"
  }
}));

const geographicLevels = [
  { name: "Brasil", code: "SERTEMBR" },
  { name: "Estados", code: "SERTEMEST" },
  { name: "Municípios", code: "SERTEMMUN" },
  { name: "AMC", code: "SERTEMAMC" },
  { name: "Área metropolitana", code: "SERTEMMET" }
];

export default function GeographicLevels() {
  const classes = useStyles();
  // component={RouterLink} to={`/series?${level.code}=1`}

  return (
    <>
      {/* <Typography variant="title1"> */}
      {/*   Explore as séries de acordo com o nível geográfico que te interessa. */}
      {/* </Typography> */}
      <div className={classes.container}>
        {geographicLevels.map(level => (
          <Card className={classes.card} key={level}>
            <Typography variant="h6" component="h2">
              <Link>{level.name}</Link>
            </Typography>
            <Typography>{level.description}</Typography>
          </Card>
        ))}
      </div>
    </>
  );
}
