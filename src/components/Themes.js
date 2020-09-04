import React, { useState, useEffect } from "react";

import { Card, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/Temas";

// color: theme.palette.blue[600],
// color: theme.palette.red[600],
// color: theme.palette.green[600],

const useStyles = makeStyles(theme => ({
  grid: {
    margin: "2em auto",
    display: "grid",
    justifyContent: "center",
    gridTemplateColumns: "repeat(auto-fit, 7rem)",
    gridAutoRows: "minmax(5em, auto)",
    gridGap: theme.spacing(2)
  },
  card: {
    padding: theme.spacing(2),
  },
  title: {
    fontSize: "0.9rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }
}));

export default function Themes() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    async function getThemes() {
      const response = await fetch(URL);
      const json = await response.json();
      setThemes(json.value);
    }

    getThemes();
  }, []);

  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.grid}>
      {themes.map(theme => {
        return (
          <Card variant="outlined" className={classes.card}>
            <Typography align="center" color="textSecondary" className={classes.title}>
              {theme.TEMNOME}
            </Typography>
          </Card>
        );
      })}
    </Container>
  );
}
