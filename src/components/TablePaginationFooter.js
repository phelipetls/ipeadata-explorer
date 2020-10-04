import React from "react";

import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import TablePaginationActions from "./TablePaginationActions";

export default function TablePaginationFooter(props) {
  const { page, count, rowsPerPage, onChangePage, onChangeRowsPerPage } = props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          SelectProps={{
            native: true,
          }}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}
