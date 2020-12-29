import * as React from "react";
import { Link, Paper, TableContainer } from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useQuery, useQueryCache } from "react-query";
import { useBreakpoint } from "utils";

import { FiltersForm } from "./components/FiltersForm";
import { FiltersContainer } from "./components/FiltersContainer";

import {
  TableSortable,
  TableCollapsedRows,
  TableSkeleton,
  PaginationFooter,
  MetadataTable,
  NoData,
} from "components";

import { limitQuery, offsetQuery } from "api/odata";
import {
  DEFAULT_SEARCH_QUERY,
  getSearchQueryFromForm,
  getSearchQueryFromUrl,
} from "api/odata";

import { SeriesMetadata } from "types";
import { TableColumn } from "types";

type MetadataDateFields = Pick<SeriesMetadata, "SERMAXDATA" | "SERMINDATA">;

const getYear = (row: SeriesMetadata, column: keyof MetadataDateFields) =>
  new Date(row[column] as string).getFullYear();

const columns: TableColumn[] = [
  {
    key: "SERNOME",
    label: "Nome",
    type: "string",
    render: (row: SeriesMetadata) => (
      <Link component={RouterLink} to={`/serie/${row.SERCODIGO}`}>
        {row.SERNOME}
      </Link>
    ),
  },
  { key: "PERNOME", label: "Frequência", type: "string" },
  { key: "UNINOME", label: "Unidade", type: "string" },
  {
    key: "SERMINDATA",
    label: "Início",
    type: "date",
    render: (row: SeriesMetadata) => getYear(row, "SERMINDATA"),
  },
  {
    key: "SERMAXDATA",
    label: "Fim",
    type: "date",
    render: (row: SeriesMetadata) => getYear(row, "SERMAXDATA"),
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

  const rows: SeriesMetadata[] = (data && data.value) || [];

  function handlePageChange(_: any, newPage: number) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));

    queryCache.invalidateQueries([searchUrl, { rowsPerPage }], {
      refetchActive: false,
    });
  }

  function onSubmit(data: Record<string, any>) {
    const newSearchUrl = getSearchQueryFromForm(data);

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

  let table: JSX.Element;
  const isLoadingRows = isLoading || isFetching || rows.length === 0;

  if (isSmallScreen) {
    table = (
      <TableCollapsedRows
        rows={rows}
        columns={["Nome", ""]}
        renderSummary={row => row["SERNOME"]}
        renderRow={row => <MetadataTable metadata={row} />}
        isLoading={isLoadingRows}
        skeleton={<TableSkeleton nRows={rowsPerPage} nColumns={2} />}
      />
    );
  } else {
    table = (
      <TableSortable
        rows={rows}
        rowKey="SERCODIGO"
        columns={columns}
        isLoading={isLoadingRows}
        skeleton={
          <TableSkeleton nRows={rowsPerPage} nColumns={columns.length} />
        }
        footer={paginationActions}
      />
    );
  }

  return (
    <>
      <FiltersContainer
        filterActive={filterActive}
        setFilterActive={setFilterActive}
      >
        <FiltersForm searchParams={searchParams} onSubmit={onSubmit} />
      </FiltersContainer>

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
