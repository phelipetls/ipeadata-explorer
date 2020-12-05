import * as React from "react";
import { Paper, TableContainer, Link } from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useQuery, useQueryCache } from "react-query";
import { useBreakpoint } from "../utils/responsive";

import { TableSortable } from "./Table/Sortable";
import { PaginationFooter } from "./Table/PaginationFooter";
import { TableSkeleton } from "./Table/Skeleton";
import { CollapsedRows } from "./Table/CollapsedRows";
import { Filters } from "./Filters";
import { MetadataTable } from "../SeriesViewer/Metadata/MetadataTable";
import { NoData } from "components/common/NoData";

import { limitQuery, offsetQuery } from "../api/odata";
import {
  DEFAULT_SEARCH_QUERY,
  getSearchQueryFromForm,
  getSearchQueryFromUrl,
} from "../api/search-queries";

import { SeriesMetadata } from "components/types";
import { Row, Column } from "./types";

const getYear = (row: Row, column: string) =>
  new Date(row[column] as string).getFullYear();

const columns: Column[] = [
  {
    key: "SERNOME",
    label: "Nome",
    render: row => (
      <Link component={RouterLink} to={`/serie/${row.SERCODIGO}`}>
        {row.SERNOME}
      </Link>
    ),
  },
  { key: "PERNOME", label: "Frequência" },
  { key: "UNINOME", label: "Unidade" },
  {
    key: "SERMINDATA",
    label: "Início",
    render: row => getYear(row, "SERMINDATA"),
  },
  {
    key: "SERMAXDATA",
    label: "Fim",
    render: row => getYear(row, "SERMAXDATA"),
  },
];

function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

export function SeriesSearch() {
  const isSmallScreen = useBreakpoint("sm");
  const queryCache = useQueryCache();
  const searchParams = useSearchParams();

  const [searchUrl, setSearchUrl] = React.useState(
    () => getSearchQueryFromUrl(searchParams) || DEFAULT_SEARCH_QUERY
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

  const rows: Row[] = (data && data.value) || [];

  function handlePageChange(
    _: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));

    queryCache.invalidateQueries([searchUrl, { rowsPerPage }], {
      refetchActive: false,
    });
  }

  function handleSubmit(data: SeriesMetadata) {
    let newSearchUrl = getSearchQueryFromForm(data);

    setSearchUrl(newSearchUrl);
    setPage(0);
    setFilterActive(false);

    queryCache.invalidateQueries([searchUrl], { refetchActive: false });
  }

  const paginationActions = (
    <PaginationFooter
      page={page}
      count={rowsCount}
      rowsPerPage={rowsPerPage}
      handleChangePage={handlePageChange}
      handleChangeRowsPerPage={handleRowsPerPageChange}
    />
  );

  const table = isSmallScreen ? (
    <CollapsedRows
      render={row => <MetadataTable metadata={row} />}
      rows={rows}
      columns={columns}
      isLoading={isLoading || isFetching}
      skeleton={<TableSkeleton nRows={rowsPerPage} nColumns={2} />}
      footer={paginationActions}
    />
  ) : (
    <TableSortable
      rows={rows}
      columns={columns}
      isLoading={isLoading || isFetching}
      skeleton={<TableSkeleton nRows={rowsPerPage} nColumns={columns.length} />}
      footer={paginationActions}
    />
  );

  return (
    <>
      <Filters
        searchParams={searchParams}
        handleSubmit={handleSubmit}
        filterActive={filterActive}
        setFilterActive={setFilterActive}
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
