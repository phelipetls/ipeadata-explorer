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
  renderSummary: (row: T) => string;
  renderRow: (row: T) => JSX.Element;
  isLoading: boolean;
  skeleton: JSX.Element;
}

export function TableCollapsedRows<T extends Row>(props: Props<T>) {
  const { columns, rows, renderSummary, renderRow, isLoading, skeleton } = props;

  const body = isLoading
    ? skeleton
    : rows.map(row => (
      <CollapsedRow summary={renderSummary(row)} key={row["SERCODIGO"]}>
        {renderRow(row)}
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
