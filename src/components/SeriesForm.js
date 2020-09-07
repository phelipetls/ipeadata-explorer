import React, { useState } from "react";

import {
  Grid,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(2)
  },
  button: {
    display: "grid",
    margin: "1em auto"
  },
  form: {
    marginTop: theme.spacing(2)
  },
  formControl: {
    minWidth: "9ch"
  }
}));

export default function SeriesForm(props) {
  const classes = useStyles();

  const [parameters, setParameters] = useState({
    SERNOME: "",
    FNTNOME: "",
    UNINOME: "",
    PERNOME: "",
    TEMNOME: "",
    PAINOME: "",
    SERMINDATA: "",
    SERMAXDATA: "",
    BASNOME: [],
    SERSTATUS: "",
    SERNUMERICA: ""
  });

  const { onSubmit } = props;

  function handleChange(e) {
    setParameters({ ...parameters, [e.target.name]: e.target.value });
  }

  function handleMultipleSelectChange(e) {
    let oldOptions = e.target.options || [];
    const newOption = e.target.value;

    oldOptions = [].filter.call(oldOptions, option => option.selected);

    setParameters({
      ...parameters,
      [e.target.name]: oldOptions.concat(newOption)
    });
  }

  function handleSelectChange(e) {
    setParameters({
      ...parameters,
      [e.target.name]: e.target.value
    });
  }

  return (
    <Grid
      container
      spacing={3}
      component="form"
      onSubmit={onSubmit}
      className={classes.form}
    >
      <Grid container item spacing={3} justify="center" name="text">
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

        <Grid item xs={6} sm={4}>
          <TextField
            size="small"
            name="PAINOME"
            value={parameters.PAINOME}
            onChange={handleChange}
            id="PAINOME"
            label="País"
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

      <Grid container item justify="space-around">
        <Grid item>
          <FormControl
            variant="outlined"
            component="fieldset"
            className={classes.formControl}
          >
            <InputLabel htmlFor="BASNOME">Base</InputLabel>
            <Select
              size="small"
              multiple
              value={parameters.BASNOME}
              onChange={handleMultipleSelectChange}
              label="Base"
              inputProps={{ name: "BASNOME", id: "BASNOME" }}
            >
              <MenuItem value="Macroeconômico">Macroeconômico</MenuItem>
              <MenuItem value="Regional">Regional</MenuItem>
              <MenuItem value="Social">Social</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl variant="outlined" component="fieldset">
            <InputLabel htmlFor="SERSTATUS">Status</InputLabel>
            <Select
              native
              size="small"
              label="Status"
              onChange={handleSelectChange}
              inputProps={{ name: "SERSTATUS", id: "SERSTATUS" }}
            >
              <option value=""></option>
              <option value="A">Ativa</option>
              <option value="I">Inativa</option>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl variant="outlined" component="fieldset">
            <InputLabel htmlFor="SERNUMERICA">Tipo</InputLabel>
            <Select
              native
              size="small"
              label="Tipo"
              onChange={handleSelectChange}
              inputProps={{ name: "SERNUMERICA", id: "SERNUMERICA" }}
            >
              <option value=""></option>
              <option value="true">Numérica</option>
              <option value="false">Alfanumérica</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container item xs={12} justify="center">
        <Button
          size="small"
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
        >
          Pesquisar
        </Button>
      </Grid>
    </Grid>
  );
}
