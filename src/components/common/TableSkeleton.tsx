import * as React from "react";

import { Skeleton } from "@material-ui/lab";
import { TableRow, TableCell } from "@material-ui/core";

interface Props {
  nRows: number;
  nColumns: number;
}

export function TableSkeleton({ nRows, nColumns }: Props) {
  return (
    <>
      {Array.from({ length: nRows }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: nColumns }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton animation={false} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
