import React, { useState } from "react";

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  TableSortLabel
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import TablePaginationActions from "./TablePaginationActions";

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxWidth: theme.breakpoints.values.sm,
    margin: "0 auto",
    marginBottom: "2em"
  }
}));

const invertSortDirections = {
  asc: "desc",
  desc: "asc"
};

const sortFunctions = {
  string: (a, b) => a.localeCompare(b),
  numeric: (a, b) => a - b,
  date: (a, b) => new Date(a) - new Date(b)
};

const formatColumnValue = (value, type) => {
  if (type === "date") return new Date(value).getFullYear();
  return value;
};

export default function SortableTable(props) {
  const classes = useStyles();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState(props.defaultOrderBy);

  const {
    columns,
    rows,
    rowKey,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage
  } = props;

  const handleSort = (e, column) => {
    if (column === orderBy) {
      setOrder(invertSortDirections[order]);
    } else {
      setOrder("desc");
      setOrderBy(column);
    }
  };

  const sortedColumn = columns.find(column => column.key === orderBy);

  if (sortedColumn) {
    const sortedColumnType = sortedColumn.type;

    const sortOrder = order === "asc" ? 1 : -1;
    const sortFunction = sortFunctions[sortedColumnType];

    const sorter = (a, b) => {
      return sortOrder * sortFunction(a, b);
    };

    rows.sort((a, b) => sorter(a[orderBy], b[orderBy]));
  }

  const tableHeaders = columns.map(column => (
    <TableCell
      component="th"
      key={column.key}
      value={column.key}
      align={column.type === "numeric" ? "right" : "left"}
      sortDirection={orderBy === column.key ? order : false}
    >
      <TableSortLabel
        active={orderBy === column.key}
        direction={orderBy === column.key ? order : "asc"}
        onClick={e => handleSort(e, column.key)}
      >
        {column.label}
      </TableSortLabel>
    </TableCell>
  ));

  const tableRows = rows.map(row => (
    <TableRow key={row[rowKey]}>
      {columns.map((column, index) => (
        <TableCell
          key={column.key}
          align={column.type === "numeric" ? "right" : "left"}
        >
          {formatColumnValue(row[column.key], column.type)}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>{tableHeaders}</TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
        {page !== undefined && (
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelDisplayedRows={() => ""}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                labelRowsPerPage="Por página:"
                SelectProps={{
                  inputProps: { "aria-label": "Linhas por página" },
                  native: true
                }}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
}
