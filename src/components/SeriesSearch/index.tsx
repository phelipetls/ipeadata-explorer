import * as React from "react";

import { Paper, TableContainer, Link } from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useQuery, useQueryCache } from "react-query";

import { TableSortable } from "../common/Table/Sortable";
import { PaginationFooter } from "../common/Table/PaginationFooter";
import { TableSkeleton } from "../common/Table/Skeleton";
import { CollapsedRows } from "../common/Table/CollapsedRows";
import { NoData } from "../common/NoData";
import { Filters } from "./Filters";
import { MetadataTable } from "../SeriesViewer/Metadata/MetadataTable";

import { useBreakpoint } from "../utils/responsive";
import { limitQuery, offsetQuery } from "../api/odata";
import {
  DEFAULT_URL,
  searchSeriesFromInputs,
  searchSeriesFromUrl,
} from "../api/search-queries";

import { SeriesMetadata } from "../types/series-metadata.ts";

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

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
    ),
  },
  { key: "PERNOME", type: "string", label: "Frequência" },
  { key: "UNINOME", type: "string", label: "Unidade" },
  { key: "SERMINDATA", type: "date", label: "Início", render: getYear },
  { key: "SERMAXDATA", type: "date", label: "Fim", render: getYear },
];

export function SeriesSearch() {
  const isSmallScreen = useBreakpoint("sm");
  const queryCache = useQueryCache();
  const searchParams = useSearchParams();

  const [searchUrl, setSearchUrl] = React.useState(
    () => searchSeriesFromUrl(searchParams) || DEFAULT_URL
  );
  const [page, setPage] = React.useState(0);
  const [rowsCount, setRowsCount] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterActive, setFilterActive] = React.useState(false);

  const { isLoading, isFetching, data } = useQuery(
    [searchUrl, { page, rowsPerPage }],
    async () => {
      const response = await fetch(
        searchUrl + limitQuery(rowsPerPage) + offsetQuery(page * rowsPerPage)
      );
      return await response.json();
    },
    {
      staleTime: Infinity,
      onSuccess: data => setRowsCount(data["@odata.count"]),
    }
  );

  const rows = (data && data.value) || [];

  function handlePageChange(_, newPage) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(e) {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));
    queryCache.invalidateQueries([searchUrl, { rowsPerPage }], {
      refetchActive: false,
    });
  }

  function handleSubmit(data: SeriesMetadata) {
    queryCache.invalidateQueries([searchUrl], { refetchActive: false });

    let newSearchUrl = searchSeriesFromInputs(data);

    setSearchUrl(newSearchUrl);
    setPage(0);
    setFilterActive(false);
  }

  const paginationActions = (
    <PaginationFooter
      page={page}
      count={rowsCount}
      rowsPerPage={rowsPerPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handleRowsPerPageChange}
    />
  );

  const table = isSmallScreen ? (
    <CollapsedRows
      isLoading={isLoading || isFetching}
      rows={rows}
      columns={columns}
      footer={paginationActions}
      skeleton={<TableSkeleton nRows={rowsPerPage} nColumns={2} />}
    >
      {row => <MetadataTable metadata={row} />}
    </CollapsedRows>
  ) : (
    <TableSortable
      isLoading={isLoading || isFetching}
      rows={rows}
      rowKey="SERCODIGO"
      columns={columns}
      footer={paginationActions}
      skeleton={<TableSkeleton nRows={rowsPerPage} nColumns={columns.length} />}
    />
  );

  return (
    <>
      <Filters
        searchParams={searchParams}
        formOpen={filterActive}
        setFormOpen={setFilterActive}
        onSubmit={handleSubmit}
      />

      {!isLoading && rows.length === 0 ? (
        <Paper>
          <NoData
            text="Nenhum resultado para essa pesquisa"
            style={{ minHeight: "300px" }}
          />
        </Paper>
      ) : (
        <TableContainer component={Paper}>{table}</TableContainer>
      )}
    </>
  );
}

export default SeriesSearch;
