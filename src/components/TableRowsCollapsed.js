import React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import TableRowCollapsed from "./TableRowCollapsed";

export default function TableRowsCollapsed(props) {
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
        {isLoading
          ? fallback
          : rows.map(row => (
              <TableRowCollapsed
                key={row.SERCODIGO}
                row={row}
                columns={columns}
              />
            ))}
      </TableBody>
      {footer}
    </Table>
  );
}