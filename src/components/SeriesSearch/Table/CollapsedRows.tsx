import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { CollapsedRow } from "./CollapsedRow";

import { Row, Column } from "../types";

interface Props {
  isLoading: boolean;
  rows: Row[];
  columns: Column[];
  footer: JSX.Element;
  skeleton: JSX.Element;
  render: (row: Row) => JSX.Element;
}

export function CollapsedRows(props: Props) {
  const { rows, columns, footer, skeleton, isLoading, render } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {isLoading || rows.length === 0
          ? skeleton
          : rows.map(row => (
              <CollapsedRow key={row.SERCODIGO} row={row} columns={columns}>
                {render(row)}
              </CollapsedRow>
            ))}
      </TableBody>
      {footer}
    </Table>
  );
}
