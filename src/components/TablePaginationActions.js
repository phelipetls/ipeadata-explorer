import React from "react";

import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { KeyboardArrowRight, KeyboardArrowLeft } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));

export default function TablePaginationActions(props) {
  const classes = useStyles();

  const { count, page, rowsPerPage, onChangePage } = props;

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Página anterior"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        onClick={handleNextButtonClick}
        aria-label="Próxima página"
      >
        <KeyboardArrowRight />
      </IconButton>
    </div>
  );
}
