import React from "react";

import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
  flexShrink: 0,
  marginLeft: theme.spacing(2.5),
  [theme.breakpoints.down("sm")]: {
    marginLeft: "auto",
  },
},
}));

interface Props {
count: number;
page: number;
rowsPerPage: number;
onChangePage: (_: any, page: number) => void;
}

export function PaginationActions(props: Props) {
  const classes = useStyles();

  const { count, page, rowsPerPage, onChangePage } = props;

  const handlePageIncrement = () => {
    onChangePage({}, page - 1);
  };

  const handlePageDecrement = () => {
    onChangePage({}, page + 1);
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handlePageIncrement}
        disabled={page === 0}
        aria-label="Página anterior"
      >
        <KeyboardArrowLeft fontSize="small" />
      </IconButton>

      <IconButton
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        onClick={handlePageDecrement}
        aria-label="Próxima página"
      >
        <KeyboardArrowRight fontSize="small" />
      </IconButton>
    </div>
  );
}
