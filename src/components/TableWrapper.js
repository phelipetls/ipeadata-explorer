import React from "react";
import { Paper, TableContainer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  tableContainer: {
    margin: "0 auto",
  },
}));

export default function TableWrapper({ children }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      {children}
    </TableContainer>
  );
}
