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

import { TableConfig } from "./types";

const useStyles = makeStyles(() => ({
  root: {
    "thead tr th:first-child": {
      width: "50%",
    },
  },
}));

type sortFunction = (a: string, b: string) => number;

interface sortFunctions {
  [index: string]: sortFunction;
}

const sortFunctions: sortFunctions = {
  date: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  str: (a, b) => a.localeCompare(b),
};

function buildSortFunction(fn: sortFunction, direction: string): sortFunction {
  const sortDirection = direction === "asc" ? 1 : -1;
  return (a, b) => sortDirection * fn(a, b);
}

interface Props<T extends Row> {
  rows: T[];
  columns: TableConfig[];
  children: (row: T) => JSX.Element;
  isLoading: boolean;
  skeleton: JSX.Element;
  footer: JSX.Element;
}

interface Row {
  [index: string]: string | null;
}

export function TableSortable<T extends Row>(props: Props<T>) {
  const classes = useStyles();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const { rows, columns, children, footer } = props;

  const handleClick = (clickedColumn: string) => {
    if (clickedColumn === orderBy) {
      setSortDirection(order => (order == "desc" ? "asc" : "desc"));
    } else {
      setSortDirection("desc");
      setOrderBy(clickedColumn);
    }
  };

  const sortedColumn = columns.find(column => column.key === orderBy);

  if (sortedColumn && orderBy !== null) {
    const sortFunctionType = sortFunctions[sortedColumn.dataType];
    const sortFunction = buildSortFunction(sortFunctionType, sortDirection);

    rows.sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      if (valueA !== null && valueB !== null) {
        return sortFunction(valueA, valueB);
      }
      return 0;
    });
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

      <TableBody>{rows.map(row => children(row))}</TableBody>

      {footer}
    </Table>
  );
}
