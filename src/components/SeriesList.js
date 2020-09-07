import React, { useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Paper,
  Collapse,
  IconButton
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";
import { queryBuilder, queryLimit, queryOffset } from "../api/odata";

import SortableTable from "./SortableTable";
import SeriesForm from "./SeriesForm";

const useStyles = makeStyles(theme => ({
  filterContainer: {
    maxWidth: theme.breakpoints.values.sm,
    padding: theme.spacing(2),
    margin: "2em auto"
  },
  collapsed: {
    marginTop: theme.spacing(2)
  }
}));

const ROWS_PER_PAGE = 5;

const URL = `http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados?$orderby=SERATUALIZACAO%20desc&$top=${ROWS_PER_PAGE}`;

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [newPageUrl, setNewPageUrl] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();

    let url = queryBuilder(e.target.elements);
    url = queryLimit(url, rowsPerPage);

    setUrl(url);
    setFormOpen(false);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);

    const totalRows = (newPage + 1) * rowsPerPage;

    if (totalRows >= data.length) {
      setNewPageUrl(queryOffset(url, (page + 1) * rowsPerPage));
    }
  };

  const handleRowsPerPageChange = e => {
    const newRowsPerPage = parseInt(e.target.value, 10);

    setPage(0);
    setRowsPerPage(newRowsPerPage);
    setUrl(url.replace(/top=[0-9]+/, `top=${newRowsPerPage}`));
  };

  useEffect(
    function fetchNewRows() {
      fetch(url)
        .then(response => response.json())
        .then(json => setData(json.value));
    },
    [url]
  );

  useEffect(
    function fetchMoreRows() {
      if (newPageUrl === "") {
        return;
      }
      fetch(newPageUrl)
        .then(response => response.json())
        .then(json => setData(data => data.concat(json.value)));
    },
    [newPageUrl]
  );

  const currentPage = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Paper className={classes.filterContainer}>
        <Grid container>
          <Typography variant="h6">Filtros</Typography>

          <IconButton
            aria-label="Expande filtros"
            size="small"
            onClick={() => setFormOpen(!formOpen)}
          >
            {formOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Grid>

        <Collapse in={formOpen}>
          <SeriesForm onSubmit={handleSubmit} />
        </Collapse>
      </Paper>

      <SortableTable
        rows={currentPage}
        columns={columns}
        rowKey="SERCODIGO"
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    </>
  );
}
