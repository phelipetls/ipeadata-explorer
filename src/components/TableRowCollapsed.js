import React, { useState } from "react";

import { TableCell, TableRow, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { SeriesMetadataTable } from "./SeriesMetadataTable";

const useStyles = makeStyles((theme) => ({
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  metadataCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  metadataTable: {
    paddingBottom: theme.spacing(1)
  }
}));

export function TableRowCollapsed({ row, columns }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const renderSeriesName = columns[0].render;

  return (
    <>
      <TableRow className={classes.row}>
        <TableCell>{renderSeriesName(row)}</TableCell>
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
        <TableCell colSpan={2} className={classes.metadataCell}>
          <Collapse in={open} className={classes.metadataTable} unmountOnExit>
            <SeriesMetadataTable metadata={row} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
