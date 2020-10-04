import React from "react";

import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import TablePaginationActions from "./TablePaginationActions";

const useStyles = makeStyles(theme => ({
  toolbar: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingTop: theme.spacing(1.5),
      flexWrap: "wrap",
      justifyContent: "center",
    },
  },
}));

export default function TablePaginationFooter(props) {
  const classes = useStyles();
  const { page, count, rowsPerPage, onChangePage, onChangeRowsPerPage } = props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          classes={{ toolbar: classes.toolbar }}
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
