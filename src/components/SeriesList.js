import React, { useState, useEffect } from "react";

import {
  buildQueryFromForm,
  buildQueryFromUrl,
  limitQuery,
  offsetQuery
} from "../api/odata";
import { useLocation } from "react-router-dom";

import SortableTable from "./SortableTable";
import SeriesFilter from "./SeriesFilter";
import TablePaginationFooter from "./TablePaginationFooter";

const BASE_URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados"
const URL = `${BASE_URL}?$count=true&$orderby=SERATUALIZACAO%20desc`;

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
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  useEffect(
    function fetchNewRows() {
      fetch(url)
        .then(response => response.json())
        .then(json => {
          setRows(json.value);
          setTotalRows(json["@odata.count"]);
        });
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
        .then(json => setRows(rows => rows.concat(json.value)));
    },
    [newPageUrl]
  );

  const paginationActions = (
    <TablePaginationFooter
      page={page}
      count={totalRows}
      rowsPerPage={rowsPerPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleRowsPerPageChange}
    />
  );

  const currentPage = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <SeriesFilter
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        onSubmit={handleSubmit}
      />

      <SortableTable
        rows={currentPage}
        columns={columns}
        footer={paginationActions}
        rowKey="SERCODIGO"
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    </>
  );
}
