import * as React from "react";
import { useForm } from "react-hook-form";

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
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "components/common";
import { useBreakpoint } from "components/utils";

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

interface Props {
  searchParams: URLSearchParams;
  onSubmit: (data: Record<string, string>) => void;
}

export function FiltersForm({ searchParams, onSubmit }: Props) {
  const classes = useStyles();
  const isExtraSmallScreen = useBreakpoint("xs");

  const {
    SERNOME,
    FNTNOME,
    UNINOME,
    PERNOME,
    TEMNOME,
    PAICODIGO,
  } = Object.fromEntries(searchParams);

  const { register, handleSubmit, formState } = useForm();

  const onSubmitDirtyFields = React.useCallback(
    data => {
      const dirtyFieldsData = {} as Record<string, any>;

      for (const [name, value] of Object.entries(data)) {
        if (name in formState.dirtyFields) {
          dirtyFieldsData[name] = value;
        }
      }

      return onSubmit(dirtyFieldsData);
    },
    [formState.dirtyFields]
  );

  return (
    <Grid
      container
      spacing={3}
      component="form"
      onSubmit={handleSubmit(onSubmitDirtyFields)}
      className={classes.form}
    >
      <Grid container item spacing={3}>
        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
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
            inputRef={register}
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
            inputRef={register}
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
            inputRef={register}
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
            inputRef={register}
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
            inputRef={register}
            size="small"
            name="PAICODIGO"
            id="PAICODIGO"
            label="País"
            defaultValue={PAICODIGO}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container item spacing={3} justify="center">
        <Grid item>
          <KeyboardDatePicker
            inputRef={register}
            size="small"
            name="SERMINDATA"
            id="start-date"
            label="Data inicial"
            style={{ width: "19ch" }}
          />
        </Grid>

        <Grid item>
          <KeyboardDatePicker
            inputRef={register}
            size="small"
            name="SERMAXDATA"
            id="end-date"
            label="Data final"
            style={{ width: "19ch" }}
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
              inputRef={register}
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
              inputRef={register}
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
              inputRef={register}
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
          control={
            <Checkbox
              inputRef={register}
              name="SERTEMBR"
              size="small"
              color="primary"
            />
          }
          label="Brasil"
        />

        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name="SERTEMMUN"
              size="small"
              color="primary"
            />
          }
          label="Municípios"
        />

        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name="SERTEMEST"
              size="small"
              color="primary"
            />
          }
          label="Estados"
        />

        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name="SERTEMMET"
              size="small"
              color="primary"
            />
          }
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
