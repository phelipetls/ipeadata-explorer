import React, { useState, useEffect } from "react";

import { Link } from "@material-ui/core";
import { useSmallScreen } from "../utils/responsive";

import { limitQuery, offsetQuery } from "../api/odata";
import { filterSeriesFromForm, filterSeriesFromUrl } from "../api/seriesFilter";
import { Link as RouterLink, useLocation } from "react-router-dom";

import TableSortable from "./TableSortable";
import SeriesFilter from "./SeriesFilter";
import TablePaginationFooter from "./TablePaginationFooter";
import TableSkeleton from "./TableSkeleton";
import TableShort from "./TableShort";
import TableWrapper from "./TableWrapper";

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

const BASE_URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados";
const URL = `${BASE_URL}?$count=true&$orderby=SERATUALIZACAO%20desc`;

const getYear = (row, column) => new Date(row[column.key]).getFullYear();

const columns = [
  {
    key: "SERNOME",
    type: "string",
    label: "Nome",
    render: row => (
      <Link component={RouterLink} to={`/serie/${row.SERCODIGO}`}>
        {row.SERNOME}
      </Link>
    )
  },
  { key: "PERNOME", type: "string", label: "Frequência" },
  { key: "UNINOME", type: "string", label: "Unidade" },
  { key: "SERMINDATA", type: "date", label: "Início", render: getYear },
  { key: "SERMAXDATA", type: "date", label: "Fim", render: getYear }
];

export default function SeriesList(props) {
  const isSmallScreen = useSmallScreen();

  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const urlFromSearchParams = filterSeriesFromUrl(searchParams);

  let [url, setUrl] = useState(
    limitQuery(urlFromSearchParams || URL, rowsPerPage)
  );
  const [newPageUrl, setNewPageUrl] = useState("");

  useEffect(() => {
    async function fetchNewRows() {
      setIsLoading(true);

      const response = await fetch(url);
      const json = await response.json();
      setRows(json.value);
      setTotalRows(json["@odata.count"]);

      setIsLoading(false);
    }

    fetchNewRows();
  }, [url]);

  function handleSubmit(e) {
    e.preventDefault();

    let url = filterSeriesFromForm(e.target.elements);
    setUrl(limitQuery(url, rowsPerPage));
    setPage(0);
    setFormOpen(false);
  }

  function handlePageChange(e, newPage) {
    setPage(newPage);

    const totalRows = (newPage + 1) * rowsPerPage;

    if (totalRows >= rows.length) {
      setNewPageUrl(offsetQuery(url, (page + 1) * rowsPerPage));
    }
  }

  function handleRowsPerPageChange(e) {
    const newRowsPerPage = parseInt(e.target.value, 10);

    setPage(0);
    setRowsPerPage(newRowsPerPage);
    setUrl(url.replace(/top=[0-9]+/, `top=${newRowsPerPage}`));
  }

  useEffect(() => {
    if (!newPageUrl) return;

    async function fetchMoreRows() {
      setIsLoading(true);

      const response = await fetch(newPageUrl);
      const json = await response.json();
      setRows(rows => rows.concat(json.value));

      setIsLoading(false);
    }

    fetchMoreRows();
  }, [newPageUrl]);

  const paginationActions = (
    <TablePaginationFooter
      page={page}
      count={totalRows}
      rowsPerPage={rowsPerPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleRowsPerPageChange}
    />
  );

  const currentPageRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  let table;

  if (isSmallScreen) {
    table = (
      <TableShort
        rows={currentPageRows}
        columns={columns}
        footer={paginationActions}
        isLoading={isLoading}
        fallback={<TableSkeleton nRows={rowsPerPage} nColumns={2} />}
      />
    );
  } else {
    table = (
      <TableSortable
        rows={currentPageRows}
        rowKey="SERCODIGO"
        columns={columns}
        footer={paginationActions}
        isLoading={isLoading}
        fallback={
          <TableSkeleton nRows={rowsPerPage} nColumns={columns.length} />
        }
      />
    );
  }

  return (
    <>
      <SeriesFilter
        searchParams={searchParams}
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        onSubmit={handleSubmit}
      />

      <TableWrapper>{table}</TableWrapper>
    </>
  );
}
