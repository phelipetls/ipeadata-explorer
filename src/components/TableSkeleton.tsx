import { TableCell, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import * as React from "react";

interface Props {
  nRows: number;
  nColumns: number;
}

export function TableSkeleton({ nRows, nColumns }: Props) {
  return (
    <>
      {Array.from({ length: nRows }).map((_, index) => (
        <TableRow key={index} data-testid="row-skeleton">
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
