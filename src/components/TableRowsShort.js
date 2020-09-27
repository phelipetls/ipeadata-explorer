import React from "react";

import TableRowCollapsed from "./TableRowCollapsed";

export default function TableRowsShort({ rows, columns }) {
  return rows.map(row => (
    <TableRowCollapsed key={row.SERCODIGO} row={row} columns={columns} />
  ));
}
