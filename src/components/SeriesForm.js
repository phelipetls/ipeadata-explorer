import React, { useState } from "react";

import {
  Grid,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import { useBreakpoint } from "../utils/responsive";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  button: {
    display: "grid",
    margin: "1em auto",
  },
  form: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: "9ch",
  },
  formGroup: {
    margin: "0 auto",
    paddingTop: "1em",
  },
  textField: {
    textAlign: "center",
  },
}));

export default function SeriesForm({ searchParams, onSubmit }) {
  const classes = useStyles();
  const isExtraSmallScreen = useBreakpoint("xs");

  const {
    SERNOME,
    FNTNOME,
    UNINOME,
    PERNOME,
    TEMNOME,
    PAINOME,
  } = Object.fromEntries(searchParams);

  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);

  return (
    <Grid
      container
      spacing={3}
      component="form"
      onSubmit={onSubmit}
      className={classes.form}
    >
      <Grid container item spacing={3}>
        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            size="small"
            name="SERNOME"
            id="SERNOME"
            label="Nome da série"
            defaultValue={SERNOME}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            size="small"
            name="FNTNOME"
            id="FNTNOME"
            label="Fonte"
            defaultValue={FNTNOME}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            size="small"
            name="UNINOME"
            id="UNINOME"
            label="Unidade"
            defaultValue={UNINOME}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            size="small"
            name="PERNOME"
            id="PERNOME"
            label="Periodicidade"
            defaultValue={PERNOME}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            size="small"
            name="TEMNOME"
            id="TEMNOME"
            label="Tema"
            defaultValue={TEMNOME}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            size="small"
            name="PAINOME"
            id="PAINOME"
            label="País"
            defaultValue={PAINOME}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container item spacing={3} justify="center">
        <Grid item>
          <KeyboardDatePicker
            value={initialDate}
            onChange={setInitialDate}
            style={{ width: "19ch" }}
            size="small"
            inputVariant="outlined"
            name="SERMINDATA"
            label="Data inicial"
            format="dd/MM/yyyy"
            mask="__/__/____"
            clearable
          />
        </Grid>

        <Grid item>
          <KeyboardDatePicker
            value={finalDate}
            onChange={setFinalDate}
            style={{ width: "19ch" }}
            size="small"
            inputVariant="outlined"
            name="SERMAXDATA"
            label="Data final"
            format="dd/MM/yyyy"
            mask="__/__/____"
            clearable
          />
        </Grid>
      </Grid>

      <Grid container item justify="center" spacing={3}>
        <Grid item>
          <FormControl
            size="small"
            variant="outlined"
            component="fieldset"
            className={classes.formControl}
          >
            <InputLabel htmlFor="BASNOME">Base</InputLabel>
            <Select
              multiple
              label="Base"
              inputProps={{ name: "BASNOME", id: "BASNOME" }}
              defaultValue={[]}
            >
              <MenuItem value="Macroeconômico">Macroeconômico</MenuItem>
              <MenuItem value="Regional">Regional</MenuItem>
              <MenuItem value="Social">Social</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl size="small" variant="outlined" component="fieldset">
            <InputLabel htmlFor="SERSTATUS">Status</InputLabel>
            <Select
              native
              label="Status"
              inputProps={{ name: "SERSTATUS", id: "SERSTATUS" }}
            >
              <option aria-label="Não selecionado" value=""></option>
              <option value="A">Ativa</option>
              <option value="I">Inativa</option>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl size="small" variant="outlined" component="fieldset">
            <InputLabel htmlFor="SERNUMERICA">Tipo</InputLabel>
            <Select
              native
              label="Tipo"
              inputProps={{ name: "SERNUMERICA", id: "SERNUMERICA" }}
            >
              <option aria-label="Não selecionado" value=""></option>
              <option value="true">Numérica</option>
              <option value="false">Alfanumérica</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <FormGroup row={!isExtraSmallScreen} className={classes.formGroup}>
        <FormControlLabel
          control={<Checkbox size="small" name="SERTEMBR" color="primary" />}
          label="Brasil"
        />

        <FormControlLabel
          control={<Checkbox size="small" name="SERTEMMUN" color="primary" />}
          label="Municípios"
        />

        <FormControlLabel
          control={<Checkbox size="small" name="SERTEMEST" color="primary" />}
          label="Estados"
        />

        <FormControlLabel
          control={<Checkbox size="small" name="SERTEMMET" color="primary" />}
          label="Área metropolitana"
        />
      </FormGroup>

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
