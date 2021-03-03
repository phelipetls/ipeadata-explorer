import { Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FilterList, GetApp } from "@material-ui/icons";
import { ChartDownloadButton } from "components";
import * as React from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { SeriesMetadata } from "types";
import { useBreakpoint } from "utils";

const useStyles = makeStyles(theme => ({
  header: {
    marginBottom: theme.spacing(3),
  },
  form: {
    display: "grid",
    gridGap: theme.spacing(2),
    gridTemplateColumns: "1fr",
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(auto-fit, minmax(19ch, 1fr))",
    },
    marginBottom: theme.spacing(3),
  },
}));

interface Props<T extends FieldValues> {
  metadata: SeriesMetadata;
  onSubmit: (data: T) => void;
  children: boolean | JSX.Element | (boolean | JSX.Element)[];
  defaultValues: Record<string, unknown>;
}

export function ChartFilters<T extends FieldValues>(props: Props<T>) {
  const classes = useStyles();
  const isSmallScreen = useBreakpoint("sm");

  const { onSubmit, defaultValues, metadata, children } = props;

  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
        className={classes.header}
      >
        <Grid item>
          <Typography variant="h5">Gráfico</Typography>
        </Grid>

        <Grid container item spacing={1} style={{ width: "unset" }}>
          <Grid item>
            <ChartDownloadButton
              filename={metadata.SERNOME}
              size="large"
              startIcon={!isSmallScreen && <GetApp />}
            >
              {isSmallScreen && <GetApp />}
            </ChartDownloadButton>
          </Grid>

          <Grid item>
            <Button
              type="submit"
              form="chart-filter"
              variant="contained"
              startIcon={!isSmallScreen && <FilterList />}
              color="primary"
              size="large"
            >
              {isSmallScreen ? <FilterList /> : "Filtrar"}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <form
        id="chart-filter"
        className={classes.form}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
