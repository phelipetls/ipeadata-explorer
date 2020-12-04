import React from "react";

import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { PaginationActions } from "./PaginationActions";

const useStyles = makeStyles(theme => ({
  toolbar: {
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      justifyContent: "center",
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(1.5),
    },
  },
}));

export function PaginationFooter(props) {
  const classes = useStyles();
  const { page, count, rowsPerPage, onChangePage, onChangeRowsPerPage } = props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          classes={{ toolbar: classes.toolbar }}
          rowsPerPageOptions={[10, 25, 50]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          SelectProps={{
            native: true,
          }}
          ActionsComponent={PaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}
