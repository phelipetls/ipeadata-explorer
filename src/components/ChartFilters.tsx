import * as React from "react";

import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, FormProvider, FieldValues } from "react-hook-form";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexFlow: "column",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      flexFlow: "row wrap",
    },
    "& > *": {
      margin: theme.spacing(1),
      [theme.breakpoints.up("md")]: {
        flexBasis: "13ch",
        flexGrow: 1,
        flexShrink: 0,
      },
    },
  },
}));

interface Props<T extends FieldValues> {
  onSubmit: (data: T) => void;
  children: JSX.Element | JSX.Element[];
  defaultValues: Record<string, unknown>;
}

export function ChartFilters<T extends FieldValues>(props: Props<T>) {
  const classes = useStyles();

  const { onSubmit, defaultValues, children } = props;

  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form className={classes.form} onSubmit={methods.handleSubmit(onSubmit)}>
        {children}

        <Button type="submit" variant="contained" color="primary">
          Filtrar
        </Button>
      </form>
    </FormProvider>
  );
}
