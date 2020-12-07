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

type sortArgument = string | number;
type sortFunction = (a: sortArgument, b: sortArgument) => number;

interface sortFunctions {
  [index: string]: sortFunction;
}

const sortFunctions: sortFunctions = {
  date: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  text: (a, b) => (a as string).localeCompare(b as string),
  numeric: (a, b) => (a as number) - (b as number)
};

function buildSortFunction(fn: sortFunction, direction: string): sortFunction {
  const sortDirection = direction === "asc" ? 1 : -1;
  return (a, b) => sortDirection * fn(a, b);
}

interface Row {
  [index: string]: string | number | null;
}

interface Props<T extends Row> {
  rows: T[];
  columns: TableConfig[];
  isLoading: boolean;
  skeleton: JSX.Element;
  footer?: JSX.Element;
}

export function TableSortable<T extends Row>(props: Props<T>) {
  const classes = useStyles();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const { rows, columns, isLoading, skeleton, footer } = props;

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

  const body = isLoading ? skeleton : rows.map(row => <TableRow key={row["PAINOME"]}>
    {columns.map(column => (
      <TableCell key={column.key} align="left">
        {column.render ? column.render(row) : row[column.key]}
      </TableCell>
    ))}
  </TableRow>);

  return (
    <Table className={classes.root} size="small">
      <TableHead>
        <TableRow>{headers}</TableRow>
      </TableHead>

      <TableBody>{body}</TableBody>

      {footer ? footer : null}
    </Table>
  );
}
