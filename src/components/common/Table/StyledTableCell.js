import React from "react";

import { TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const TableCellWithStyles = withStyles(() => ({
  head: {
    fontWeight: "bold",
  },
}))(TableCell);

export function StyledTableCell({ children, ...props }) {
  return <TableCellWithStyles {...props}>{children}</TableCellWithStyles>;
}
