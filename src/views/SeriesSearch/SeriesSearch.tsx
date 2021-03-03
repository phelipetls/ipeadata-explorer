import { Link, Paper, TableContainer } from "@material-ui/core";
import {
  buildSearchUrl,
  getSearchValuesFromUrl,
  limitQuery,
  offsetQuery,
} from "api/odata";
import {
  EmptyState,
  MetadataTable,
  PaginationFooter,
  TableCollapsedRows,
  TableSkeleton,
  TableSortable,
} from "components";
import { useSyncSearchParams } from "hooks";
import * as React from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link as RouterLink, useLocation } from "react-router-dom";
import axios from "redaxios";
import { SeriesMetadata, TableColumn } from "types";
import { useBreakpoint } from "utils";
import { SearchFilterContainer, SearchFilterForm } from "./components";

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

const DEFAULT_PAGE = 0;
const DEFAULT_ROWS_PER_PAGE = 10;

export function SeriesSearch() {
  const isSmallScreen = useBreakpoint("sm");
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [searchValues, setSearchValues] = React.useState(() =>
    getSearchValuesFromUrl(searchParams)
  );

  const [page, setPage] = React.useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(
    Number(searchParams.get("rowsPerPage")) || DEFAULT_ROWS_PER_PAGE
  );

  const [totalCount, setTotalCount] = React.useState(0);

  const [filterActive, setFilterActive] = React.useState(false);

  const { isLoading, isFetching, data } = useQuery(
    [{ searchValues, page, rowsPerPage }],
    async () => {
      const url =
        buildSearchUrl(searchValues) +
        limitQuery(rowsPerPage) +
        offsetQuery(page * rowsPerPage);

      const response = await axios.get(url);
      return response.data;
    },
    {
      staleTime: Infinity,
      onSuccess: data => setTotalCount(data["@odata.count"]),
    }
  );

  const rows: SeriesMetadata[] = data?.value || [];

  const stateToSync = React.useMemo(
    () => ({
      page: page !== DEFAULT_PAGE ? page : null,
      rowsPerPage: rowsPerPage !== DEFAULT_ROWS_PER_PAGE ? rowsPerPage : null,
      ...searchValues,
    }),
    [page, rowsPerPage, searchValues]
  );

  useSyncSearchParams(stateToSync);

  function handlePageChange(_: any, newPage: number) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));

    queryClient.invalidateQueries([{ searchValues, rowsPerPage }], {
      refetchActive: false,
    });
  }

  function handleSubmit(data: Record<string, any>) {
    setSearchValues(data);
    setPage(0);
    setFilterActive(false);

    queryClient.invalidateQueries([{ searchValues }], { refetchActive: false });
  }

  const paginationActions = (
    <PaginationFooter
      page={page}
      count={totalCount}
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
        renderSummary={row => (
          <Link component={RouterLink} to={`/serie/${row.SERCODIGO}`}>
            {row.SERNOME}
          </Link>
        )}
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
      <SearchFilterContainer
        filterActive={filterActive}
        setFilterActive={setFilterActive}
      >
        <SearchFilterForm searchParams={searchParams} onSubmit={handleSubmit} />
      </SearchFilterContainer>

      {!isLoading && rows.length === 0 ? (
        <Paper>
          <EmptyState
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
