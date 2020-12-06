import React, { useState } from "react";

import { TableCell, TableRow, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  summaryRow: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  collapsedCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  collapsed: {
    paddingBottom: theme.spacing(1),
  },
}));

interface Props {
  summary: string;
  children: JSX.Element;
}

export function CollapsedRow({ summary, children }: Props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={classes.summaryRow}>
        <TableCell>{summary}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="Expandir linha"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={2} className={classes.collapsedCell}>
          <Collapse in={open} unmountOnExit className={classes.collapsed}>
            {children}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
