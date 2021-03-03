import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import * as React from "react";
import { SeriesMetadata } from "types";
import { CollapsedRow } from "./CollapsedRow";

interface Props {
  rows: SeriesMetadata[];
  columns: string[];
  renderSummary: (row: SeriesMetadata) => JSX.Element;
  renderRow: (row: SeriesMetadata) => JSX.Element;
  isLoading: boolean;
  skeleton: JSX.Element;
}

export function TableCollapsedRows(props: Props) {
  const {
    columns,
    rows,
    renderSummary,
    renderRow,
    isLoading,
    skeleton,
  } = props;

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
            <TableCell key={column}>{column}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{body}</TableBody>
    </Table>
  );
}
