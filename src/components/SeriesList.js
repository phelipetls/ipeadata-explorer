import React, { useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Paper,
  Collapse,
  IconButton,
  TableRow,
  TableFooter,
  TablePagination
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import {
  buildQueryFromForm,
  buildQueryFromUrl,
  limitQuery,
  offsetQuery
} from "../api/odata";
import { useLocation } from "react-router-dom";

import SortableTable from "./SortableTable";
import SeriesForm from "./SeriesForm";
import TablePaginationActions from "./TablePaginationActions";

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
const URL = `http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados?$orderby=SERATUALIZACAO%20desc`;

const getYear = (row, column) => new Date(row[column.key]).getFullYear();

const columns = [
  { key: "SERNOME", type: "string", label: "Nome" },
  { key: "PERNOME", type: "string", label: "Frequência" },
  { key: "UNINOME", type: "string", label: "Unidade" },
  { key: "SERMINDATA", type: "date", label: "Início", render: getYear },
  { key: "SERMAXDATA", type: "date", label: "Fim", render: getYear }
];

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

export default function SeriesList(props) {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [newPageUrl, setNewPageUrl] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const searchParams = useSearchParams();
  const searchUrl = buildQueryFromUrl(searchParams);

  let [url, setUrl] = useState(searchUrl || URL);
  url = limitQuery(url, rowsPerPage);

  function handleSubmit(e) {
    e.preventDefault();

    let url = buildQueryFromForm(e.target.elements);
    setUrl(url);
    setFormOpen(false);
  };

  function handlePageChange(e, newPage) {
    setPage(newPage);

    const totalRows = (newPage + 1) * rowsPerPage;

    if (totalRows >= data.length) {
      setNewPageUrl(offsetQuery(url, (page + 1) * rowsPerPage));
    }
  };

  function handleRowsPerPageChange(e) {
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

  const paginationActions = (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          colSpan={6}
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelDisplayedRows={() => ""}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          labelRowsPerPage="Por página:"
          SelectProps={{
            inputProps: { "aria-label": "Linhas por página" },
            native: true
          }}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
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
      >
        {paginationActions}
      </SortableTable>
    </>
  );
}
