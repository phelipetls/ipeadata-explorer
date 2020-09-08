import React from "react";
import { Skeleton } from "@material-ui/lab";
import { TableRow, TableCell } from "@material-ui/core";

export default function TableSkeleton({ rows, columns }) {
  return Array(rows).fill(null).map((_, index) => (
    <TableRow key={index}>
      {Array(columns).fill(null).map((_, index) =>
      <TableCell key={index}>
        <Skeleton animation={false} />
      </TableCell>
      )}
    </TableRow>
  ));
}
