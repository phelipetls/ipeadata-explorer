import React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

import TableRowsShort from "./TableRowsShort";

export default function TableShort(props) {
  const { rows, columns, footer, fallback, isLoading } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          fallback
        ) : (
          <TableRowsShort rows={rows} columns={columns} />
        )}
      </TableBody>
      {footer}
    </Table>
  );
}
