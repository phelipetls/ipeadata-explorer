import { TableFooter, TablePagination, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { PaginationActions } from "./PaginationActions";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      justifyContent: "center",
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(1.5),
    },
  },
}));

interface Props {
  page: number;
  count: number;
  rowsPerPage: number;
  handleChangePage: (e: any, newPage: number) => void;
  handleChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PaginationFooter(props: Props) {
  const classes = useStyles();

  const {
    page,
    count,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          classes={{ toolbar: classes.toolbar }}
          rowsPerPageOptions={[10, 25, 50]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          SelectProps={{
            native: true,
          }}
          ActionsComponent={PaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}
