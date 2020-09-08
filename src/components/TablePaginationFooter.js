import React from "react";

import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import TablePaginationActions from "./TablePaginationActions";

export default function TablePaginationFooter(props) {
  const {
    page,
    count,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage
  } = props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          colSpan={6}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          labelRowsPerPage="Por página:"
          SelectProps={{
            inputProps: { "aria-label": "Linhas por página" },
            native: true
          }}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}
