import * as React from "react";
import {
  Link,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useQuery, useQueryCache } from "react-query";
import { useBreakpoint } from "../utils/responsive";

import { Filters } from "./Filters";
import { PaginationFooter } from "components/common/Table/PaginationFooter";
import { CollapsedRow } from "components/common/Table/CollapsedRow";
import { TableSkeleton } from "components/common/Table/TableSkeleton";
import { TableSortable } from "components/common/Table/TableSortable";
import { MetadataTable } from "../SeriesViewer/Metadata/MetadataTable";
import { NoData } from "components/common/NoData";

import { limitQuery, offsetQuery } from "../api/odata";
import {
  DEFAULT_SEARCH_QUERY,
  getSearchQueryFromForm,
  getSearchQueryFromUrl,
} from "../api/search-queries";

import { Row } from "./types";
import { SeriesMetadata } from "components/types";
import { TableConfig } from "components/common/Table/TableSortable/types";

const getYear = (row: Row, column: string) =>
  new Date(row[column] as string).getFullYear();

const columns: TableConfig[] = [
  {
    key: "SERNOME",
    label: "Nome",
    dataType: "string",
    render: (row: Row) => (
      <Link component={RouterLink} to={`/serie/${row.SERCODIGO}`}>
        {row.SERNOME}
      </Link>
    ),
  },
  { key: "PERNOME", label: "Frequência", dataType: "string" },
  { key: "UNINOME", label: "Unidade", dataType: "string" },
  {
    key: "SERMINDATA",
    label: "Início",
    dataType: "date",
    render: (row: Row) => getYear(row, "SERMINDATA"),
  },
  {
    key: "SERMAXDATA",
    label: "Fim",
    dataType: "date",
    render: (row: Row) => getYear(row, "SERMAXDATA"),
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

  let table: JSX.Element;
  const loadingRows = isLoading || isFetching || rows.length === 0;

  if (isSmallScreen) {
    table = <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loadingRows ? <TableSkeleton nRows={rowsPerPage} nColumns={2} /> : rows.map(row => (
          <CollapsedRow summary={row["SERNOME"]} key={row["SERCODIGO"]}>
            <MetadataTable metadata={row} />
          </CollapsedRow>
        ))}
      </TableBody>
    </Table>
  } else {
    table = (
      <TableSortable
        rows={rows}
        columns={columns}
        isLoading={loadingRows}
        skeleton={<TableSkeleton nRows={rowsPerPage} nColumns={columns.length} />}
        footer={paginationActions}
      >
        {row => (
          <TableRow key={row["SERCODIGO"]}>
            {columns.map(column => (
              <TableCell key={column.key} align="left">
                {column.render ? column.render(row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableSortable>
    );
  }

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
