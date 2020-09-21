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
import { DatePicker } from "@material-ui/pickers";
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

  const {
    SERNOME,
    FNTNOME,
    UNINOME,
    PERNOME,
    TEMNOME,
    BASNOME,
    SERNUMERICA,
    SERSTATUS,
    PAINOME
  } = Object.fromEntries(props.searchParams);

  const [name, setName] = useState(SERNOME || "");
  const [source, setSource] = useState(FNTNOME || "");
  const [unit, setUnit] = useState(UNINOME || "");
  const [periodicty, setPeriodicty] = useState(PERNOME || "");
  const [theme, setTheme] = useState(TEMNOME || "");
  const [country, setCountry] = useState(PAINOME || "");
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [bases, setBases] = useState([BASNOME] || []);
  const [status, setStatus] = useState(SERSTATUS || "");
  const [isNumeric, setIsNumeric] = useState(SERNUMERICA || "");

  const { onSubmit } = props;

  function handleChangeBases(e) {
    setBases(
      Array.from(e.target.options || [])
        .filter(option => option.selected)
        .concat(e.target.value)
    );
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
            value={name}
            onChange={e => setName(e.target.value)}
            id="SERNOME"
            label="Nome da série"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            size="small"
            name="FNTNOME"
            value={source}
            onChange={e => setSource(e.target.value)}
            id="FNTNOME"
            label="Fonte"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            size="small"
            name="UNINOME"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            id="UNINOME"
            label="Unidade"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            size="small"
            name="PERNOME"
            value={periodicty}
            onChange={e => setPeriodicty(e.target.value)}
            id="PERNOME"
            label="Periodicidade"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            size="small"
            name="TEMNOME"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            id="TEMNOME"
            label="Tema"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            size="small"
            name="PAINOME"
            value={country}
            onChange={e => setCountry(e.target.value)}
            id="PAINOME"
            label="País"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container item spacing={3} justify="center">
        <Grid item>
          <DatePicker
            inputVariant="outlined"
            name="SERMINDATA"
            label="Data inicial"
            value={initialDate}
            onChange={setInitialDate}
            format="dd/MM/yyyy"
          />
        </Grid>

        <Grid item>
          <DatePicker
            inputVariant="outlined"
            name="SERMAXDATA"
            label="Data final"
            value={finalDate}
            onChange={setFinalDate}
            format="dd/MM/yyyy"
          />
        </Grid>
      </Grid>

      <Grid container item justify="space-around" spacing={2}>
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
              value={bases}
              onChange={handleChangeBases}
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
              value={status}
              onChange={e => setStatus(e.target.value)}
              inputProps={{ name: "SERSTATUS", id: "SERSTATUS" }}
            >
              <option aria-label="Não selecionado" value=""></option>
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
              value={isNumeric}
              onChange={e => setIsNumeric(e.target.value)}
              inputProps={{ name: "SERNUMERICA", id: "SERNUMERICA" }}
            >
              <option aria-label="Não selecionado" value=""></option>
              <option value="true">Numérica</option>
              <option value="false">Alfanumérica</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container item xs={12} justify="center">
        <Button
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
