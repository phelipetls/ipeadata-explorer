import React from "react";

import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import TablePaginationActions from "./TablePaginationActions";

export default function TablePaginationFooter(props) {
  const { data, page, rowsPerPage, onChangePage, onChangeRowsPerPage } = props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          colSpan={6}
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelDisplayedRows={() => ""}
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
