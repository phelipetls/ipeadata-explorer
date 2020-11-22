import React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import { CollapsedRow } from "./CollapsedRow";

export function CollapsedRows(props) {
  const { rows, columns, footer, skeleton, isLoading, children } = props;

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
                {children(row)}
              </CollapsedRow>
            ))}
      </TableBody>
      {footer}
    </Table>
  );
}
