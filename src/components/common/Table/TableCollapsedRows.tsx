import * as React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { CollapsedRow } from "./CollapsedRow";

interface Row {
  [index: string]: string | number | null;
}

interface Props<T> {
  rows: T[];
  columns: string[];
  summary: (row: T) => string;
  render: (row: T) => JSX.Element;
  isLoading: boolean;
  skeleton: JSX.Element;
}

export function TableCollapsedRows<T extends Row>(props: Props<T>) {
  const { columns, rows, summary, render, isLoading, skeleton } = props;

  const body = isLoading
    ? skeleton
    : rows.map(row => (
      <CollapsedRow summary={summary(row)} key={row["SERCODIGO"]}>
        {render(row)}
      </CollapsedRow>
    ));

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell>{column}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{body}</TableBody>
    </Table>
  );
}
