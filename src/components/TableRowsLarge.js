import React from "react";

import { TableRow, TableCell } from "@material-ui/core";

export default function TableRowsLarge({ rows, columns, rowKey }) {
  return rows.map(row => (
    <TableRow key={row[rowKey]}>
      {columns.map(column => (
        <TableCell
          key={column.key}
          align={column.type === "numeric" ? "right" : "left"}
        >
          {column.render ? column.render(row, column) : row[column.key]}
        </TableCell>
      ))}
    </TableRow>
  ));
}
