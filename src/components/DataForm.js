import React, { useState } from "react";

import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  // Switch,
  // Checkbox,
  // FormGroup,
  // FormLabel,
  // FormControl,
  // FormControlLabel,
  // Select,
  // MenuItem,
  // InputLabel
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { queryBuilder } from "../api/query";

const useStyles = makeStyles(theme => ({
  form: {
    maxWidth: theme.breakpoints.values.sm,
    padding: theme.spacing(2),
    margin: "2em auto"
  },
  dates: {},
  title: {
    marginBottom: theme.spacing(2)
  },
  button: {
    display: "grid",
    margin: "1em auto"
  }
}));

export default function DataForm() {
  const classes = useStyles();
  const [parameters, setParameters] = useState({
    SERNOME: "",
    FNTNOME: "",
    UNINOME: "",
    PERNOME: "",
    TEMNOME: "",
    SERMINDATA: "",
    SERMAXDATA: "",
    BASNOME: ["Macroeconômico", "Regional", "Social"],
  })

  const handleSubmit = e => {
    e.preventDefault();
    console.log(queryBuilder(e.target.elements));
  };

  const handleChange = e => {
    setParameters({...parameters, [e.target.name]: e.target.value})
  }

  return (
    <Paper
      component="form"
      id="parameters"
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" className={classes.title}>
        Filtros
      </Typography>

      <Grid container spacing={3}>
        <Grid container item spacing={3} justify="center">
          <Grid item xs={6} sm={4}>
            <TextField
              size="small"
              name="SERNOME"
              value={parameters.SERNOME}
              onChange={handleChange}
              id="SERNOME"
              label="Nome da série"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              size="small"
              name="FNTNOME"
              value={parameters.FNTNOME}
              onChange={handleChange}
              id="FNTNOME"
              label="Fonte"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              size="small"
              name="UNINOME"
              value={parameters.UNINOME}
              onChange={handleChange}
              id="UNINOME"
              label="Unidade"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              size="small"
              name="PERNOME"
              value={parameters.PERNOME}
              onChange={handleChange}
              id="PERNOME"
              label="Periodicidade"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              size="small"
              name="TEMNOME"
              value={parameters.TEMNOME}
              onChange={handleChange}
              id="TEMNOME"
              label="Tema"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid container item spacing={3} justify="center">
          <Grid item>
            <TextField
              size="small"
              label="Data inicial"
              name="SERMINDATA"
              value={parameters.SERMINDATA}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>

          <Grid item>
            <TextField
              size="small"
              label="Data final"
              name="SERMAXDATA"
              value={parameters.SERMAXDATA}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Button
        size="small"
        variant="contained"
        color="primary"
        type="submit"
        className={classes.button}
      >
        Pesquisar
      </Button>
    </Paper>
  );
}
