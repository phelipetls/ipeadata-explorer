import React, { useState, useEffect } from "react";

import { Grid, Typography, Paper, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import SortableTable from "./SortableTable";
import SeriesForm from "./SeriesForm";

const useStyles = makeStyles(theme => ({
  filterContainer: {
    maxWidth: theme.breakpoints.values.sm,
    padding: theme.spacing(2),
    margin: "2em auto"
  },
  collapsed: {
    marginTop: theme.spacing(2),
  }
}));

const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados?$orderby=SERATUALIZACAO%20desc&$top=10";

const columns = [
  { key: "SERNOME", type: "string", label: "Nome" },
  { key: "PERNOME", type: "string", label: "Frequência" },
  { key: "UNINOME", type: "string", label: "Unidade" },
  { key: "SERMINDATA", type: "date", label: "Início" },
  { key: "SERMAXDATA", type: "date", label: "Fim" }
];

export default function SeriesList(props) {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [url, setUrl] = useState(URL);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchDataList() {
      const response = await fetch(url);
      const json = await response.json();
      setData(data => data.concat(json.value));
    }

    // fetchDataList();
  }, [url]);

  return (
    <>
      <Paper className={classes.filterContainer}>
        <Grid container>
          <Typography variant="h5">
            Filtros
          </Typography>

          <IconButton
            aria-label="Expande filtros"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Grid>

        <Collapse in={open} unmountOnExit>
          <SeriesForm setUrl={setUrl} />
        </Collapse>
      </Paper>

      <SortableTable data={data} columns={columns} rowKey="SERCODIGO" />
    </>
  );
}
