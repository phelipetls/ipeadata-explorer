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

import { Row, Column } from "../types";

const useStyles = makeStyles(() => ({
  root: {
    "thead tr th:first-child": {
      width: "50%",
    },
  },
}));

type sortFunction = (a: string, b: string) => number;

const stringSort: sortFunction = (a, b) => a.localeCompare(b);
const dateSort: sortFunction = (a, b) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

const getColumnSortFunction = (column: Column) => {
  if (column.key.endsWith("DATA")) return dateSort;
  return stringSort;
};

const getSortFunction = (fn: sortFunction, direction: string): sortFunction => {
  const sortDirection = direction === "asc" ? 1 : -1;
  return (a, b) => sortDirection * fn(a, b);
};

interface Props {
  isLoading: boolean;
  rows: Row[];
  columns: Column[];
  footer: JSX.Element;
  skeleton: JSX.Element;
}

export function TableSortable(props: Props) {
  const classes = useStyles();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const { columns, rows, footer, isLoading, skeleton } = props;

  const handleClick = (clickedColumn: string) => {
    if (clickedColumn === orderBy) {
      setSortDirection(order => (order == "desc" ? "asc" : "desc"));
    } else {
      setSortDirection("desc");
      setOrderBy(clickedColumn);
    }
  };

  const sortedColumn = columns.find(column => column.key === orderBy);

  if (orderBy !== null && sortedColumn) {
    const sortFunction = getColumnSortFunction(sortedColumn);
    const sorter = getSortFunction(sortFunction, sortDirection);

    rows.sort((a, b) => sorter(a[orderBy], b[orderBy]));
  }

  const headers = columns.map(column => (
    <TableCell
      component="th"
      key={column.key}
      align="left"
      sortDirection={column.key === orderBy ? sortDirection : false}
    >
      <TableSortLabel
        active={orderBy === column.key}
        direction={orderBy === column.key ? sortDirection : "asc"}
        onClick={() => handleClick(column.key)}
      >
        {column.label}
      </TableSortLabel>
    </TableCell>
  ));

  return (
    <Table className={classes.root} size="small">
      <TableHead>
        <TableRow>{headers}</TableRow>
      </TableHead>

      <TableBody>
        {isLoading || rows.length === 0
          ? skeleton
          : rows.map(row => (
              <TableRow key={row["SERCODIGO"]}>
                {columns.map(column => (
                  <TableCell key={column.key} align="left">
                    {column.render
                      ? column.render(row, column)
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
      </TableBody>
      {footer}
    </Table>
  );
}
