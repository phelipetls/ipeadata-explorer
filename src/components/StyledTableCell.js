import React from "react";

import { TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const TableCellWithStyles = withStyles(theme => ({
  head: {
    fontWeight: "bold",
  },
}))(TableCell);

export default function StyledTableCell({ children, ...props }) {
  return <TableCellWithStyles {...props}>{children}</TableCellWithStyles>;
}
