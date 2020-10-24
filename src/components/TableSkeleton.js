import React from "react";

import { Skeleton } from "@material-ui/lab";
import { TableRow, TableCell } from "@material-ui/core";

export default function TableSkeleton({ nRows, nColumns }) {
  return Array.from({ length: nRows }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: nColumns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton animation={false} />
        </TableCell>
      ))}
    </TableRow>
  ));
}
