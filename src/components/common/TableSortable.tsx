import * as React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TableColumn, SeriesMetadata } from "components/types";

const useStyles = makeStyles(() => ({
  root: {
    "thead tr th:first-child": {
      width: "50%",
    },
  },
}));

type sortFunction = (a: any, b: any) => number;

const sortFunctionNumeric: sortFunction = (a, b) => a - b;
const sortFunctionString: sortFunction = (a, b) => a.localeCompare(b);
const sortFunctionDate: sortFunction = (a, b) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

type ColumnType = NonNullable<TableColumn["type"]>;

const sortFunctions: Record<ColumnType, sortFunction> = {
  string: sortFunctionString,
  numeric: sortFunctionNumeric,
  date: sortFunctionDate,
};

interface Props<T = SeriesMetadata> {
  rows: T[];
  rowKey: keyof T;
  columns: TableColumn<T>[];
  isLoading: boolean;
  skeleton: JSX.Element;
  footer?: JSX.Element;
}

export function TableSortable<T = SeriesMetadata>(props: Props<T>) {
  const classes = useStyles();

  const [orderByColumn, setOrderByColumn] = React.useState<keyof T | null>(
    null
  );
  const [sortDirection, setSortDirection] = React.useState<"desc" | "asc">(
    "desc"
  );

  const { rows, rowKey, columns, isLoading, skeleton, footer } = props;

  const handleClick = (targetColumn: keyof T) => {
    if (targetColumn === orderByColumn) {
      setSortDirection(order => (order == "desc" ? "asc" : "desc"));
    } else {
      setSortDirection("desc");
      setOrderByColumn(targetColumn);
    }
  };

  const sortedColumn = columns.find(column => column.key === orderByColumn);

  if (sortedColumn && sortedColumn.type && orderByColumn !== null) {
    const sortFunction = sortFunctions[sortedColumn.type];

    rows.sort((a, b) => {
      const valueA = a[orderByColumn];
      const valueB = b[orderByColumn];

      const direction = sortDirection === "asc" ? 1 : -1;

      if (valueA === null || valueB === null) {
        return -1;
      }

      return direction * sortFunction(valueA, valueB);
    });
  }

  const headers = columns.map(column => (
    <TableCell
      component="th"
      key={String(column.key)}
      align="left"
      sortDirection={column.key === orderByColumn ? sortDirection : false}
    >
      <TableSortLabel
        active={orderByColumn === column.key}
        direction={orderByColumn === column.key ? sortDirection : "asc"}
        onClick={() => handleClick(column.key)}
      >
        {column.label}
      </TableSortLabel>
    </TableCell>
  ));

  const body = isLoading
    ? skeleton
    : rows.map(row => (
        <TableRow key={String(row[rowKey])}>
          {columns.map(column => (
            <TableCell key={String(column.key)} align="left">
              {column.render ? column.render(row) : row[column.key]}
            </TableCell>
          ))}
        </TableRow>
      ));

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
