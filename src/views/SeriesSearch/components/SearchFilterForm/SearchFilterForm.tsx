import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { HfKeyboardDatePicker } from 'components'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useBreakpoint } from 'utils'

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  button: {
    display: 'grid',
    margin: '1em auto',
  },
  form: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: '9ch',
  },
  formGroup: {
    margin: '0 auto',
    paddingTop: '1em',
  },
  textField: {
    textAlign: 'center',
  },
}))

interface SearchFilterFormData {
  SERNOME: string
  FNTNOME: string
  UNINOME: string
  PERNOME: string
  TEMNOME: string
  PAICODIGO: string
  BASNOME: string[]
  SERSTATUS: string
  SERNUMERICA: string
  SERTEMBR: boolean
  SERTEMMUN: boolean
  SERTEMEST: boolean
  SERTEMMET: boolean
  SERMINDATA: Date | null
  SERMAXDATA: Date | null
}

interface Props {
  searchParams: URLSearchParams
  onSubmit: (data: Record<string, string>) => void
}

export function SearchFilterForm({ searchParams, onSubmit }: Props) {
  const classes = useStyles()
  const isExtraSmallScreen = useBreakpoint('xs')

  const {
    SERNOME,
    FNTNOME,
    UNINOME,
    PERNOME,
    TEMNOME,
    PAICODIGO,
    BASNOME,
    SERSTATUS,
    SERNUMERICA,
    SERTEMBR,
    SERTEMMUN,
    SERTEMEST,
    SERTEMMET,
    SERMINDATA = null,
    SERMAXDATA = null,
  } = Object.fromEntries(searchParams)

  const { register, handleSubmit, formState, control } =
    useForm<SearchFilterFormData>({
      defaultValues: {
        SERNOME,
        FNTNOME,
        UNINOME,
        PERNOME,
        TEMNOME,
        PAICODIGO,
        BASNOME: BASNOME ? BASNOME.split(',') : [],
        SERSTATUS,
        SERNUMERICA,
        SERTEMBR: Boolean(SERTEMBR),
        SERTEMMUN: Boolean(SERTEMMUN),
        SERTEMEST: Boolean(SERTEMEST),
        SERTEMMET: Boolean(SERTEMMET),
        SERMINDATA,
        SERMAXDATA,
      },
    })

  const onSubmitDirtyFields = React.useCallback(
    (data: SearchFilterFormData) => {
      const dirtyFieldsData = Object.entries(data).filter(
        ([name]) => name in formState.dirtyFields
      )

      return onSubmit(Object.fromEntries(dirtyFieldsData))
    },
    [onSubmit, formState.dirtyFields]
  )

  return (
    <Grid
      container
      spacing={3}
      component='form'
      onSubmit={handleSubmit(onSubmitDirtyFields)}
      className={classes.form}
    >
      <Grid container item spacing={3}>
        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
            size='small'
            name='SERNOME'
            id='SERNOME'
            label='Nome da série'
            variant='outlined'
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
            size='small'
            name='FNTNOME'
            id='FNTNOME'
            label='Fonte'
            variant='outlined'
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
            size='small'
            name='UNINOME'
            id='UNINOME'
            label='Unidade'
            variant='outlined'
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
            size='small'
            name='PERNOME'
            id='PERNOME'
            label='Periodicidade'
            variant='outlined'
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
            size='small'
            name='TEMNOME'
            id='TEMNOME'
            label='Tema'
            variant='outlined'
          />
        </Grid>

        <Grid item xs={6} sm={4} className={classes.textField}>
          <TextField
            inputRef={register}
            size='small'
            name='PAICODIGO'
            id='PAICODIGO'
            label='País'
            variant='outlined'
          />
        </Grid>
      </Grid>

      <Grid container item spacing={3} justify='center'>
        <Grid item>
          <HfKeyboardDatePicker
            control={control}
            name='SERMINDATA'
            label='Data inicial'
            size='small'
            id='start-date'
            style={{ width: '19ch' }}
          />
        </Grid>

        <Grid item>
          <HfKeyboardDatePicker
            control={control}
            name='SERMAXDATA'
            label='Data final'
            size='small'
            id='end-date'
            style={{ width: '19ch' }}
          />
        </Grid>
      </Grid>

      <Grid container item justify='center' spacing={3}>
        <Grid item>
          <FormControl
            size='small'
            variant='outlined'
            component='fieldset'
            className={classes.formControl}
          >
            <InputLabel htmlFor='BASNOME'>Base</InputLabel>
            <Controller
              control={control}
              name='BASNOME'
              as={
                <Select
                  multiple
                  label='Base'
                  inputProps={{
                    id: 'BASNOME',
                  }}
                >
                  <MenuItem value='Macroeconômico'>Macroeconômico</MenuItem>
                  <MenuItem value='Regional'>Regional</MenuItem>
                  <MenuItem value='Social'>Social</MenuItem>
                </Select>
              }
            />
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl size='small' variant='outlined' component='fieldset'>
            <InputLabel htmlFor='SERSTATUS'>Status</InputLabel>
            <Select
              native
              inputRef={register}
              label='Status'
              inputProps={{ name: 'SERSTATUS', id: 'SERSTATUS' }}
            >
              <option aria-label='Não selecionado' value=''></option>
              <option value='A'>Ativa</option>
              <option value='I'>Inativa</option>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl size='small' variant='outlined' component='fieldset'>
            <InputLabel htmlFor='SERNUMERICA'>Tipo</InputLabel>
            <Select
              native
              inputRef={register}
              label='Tipo'
              inputProps={{ name: 'SERNUMERICA', id: 'SERNUMERICA' }}
            >
              <option aria-label='Não selecionado' value=''></option>
              <option value='true'>Numérica</option>
              <option value='false'>Alfanumérica</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <FormGroup row={!isExtraSmallScreen} className={classes.formGroup}>
        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name='SERTEMBR'
              size='small'
              color='primary'
            />
          }
          label='Brasil'
        />

        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name='SERTEMMUN'
              size='small'
              color='primary'
            />
          }
          label='Municípios'
        />

        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name='SERTEMEST'
              size='small'
              color='primary'
            />
          }
          label='Estados'
        />

        <FormControlLabel
          control={
            <Checkbox
              inputRef={register}
              name='SERTEMMET'
              size='small'
              color='primary'
            />
          }
          label='Área metropolitana'
        />
      </FormGroup>

      <Grid container item xs={12} justify='center'>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          className={classes.button}
        >
          Pesquisar
        </Button>
      </Grid>
    </Grid>
  )
}
