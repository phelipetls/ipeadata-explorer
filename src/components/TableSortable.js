import React, { useState } from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import TableRowsLarge from "./TableRowsLarge";

const useStyles = makeStyles(theme => ({
  table: {
    "thead tr th:first-child": {
      width: "50%",
    },
  },
}));

const invertSortDirections = {
  asc: "desc",
  desc: "asc",
};

const sortFunctions = {
  string: (a, b) => a.localeCompare(b),
  numeric: (a, b) => a - b,
  date: (a, b) => new Date(a) - new Date(b),
};

export default function TableSortable(props) {
  const classes = useStyles();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState(props.defaultOrderBy);

  const { columns, rows, rowKey, footer, isLoading, skeleton } = props;

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
    const sortOrder = order === "asc" ? 1 : -1;
    const sortFunction = sortFunctions[sortedColumn.type];

    const sorter = (a, b) => {
      return sortOrder * sortFunction(a, b);
    };

    rows.sort((a, b) => sorter(a[orderBy], b[orderBy]));
  }

  const headers = columns.map(column => (
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

  return (
    <Table className={classes.table} size="small">
      <TableHead>
        <TableRow>{headers}</TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          skeleton
        ) : (
          <TableRowsLarge rows={rows} columns={columns} rowKey={rowKey} />
        )}
      </TableBody>
      {footer}
    </Table>
  );
}
