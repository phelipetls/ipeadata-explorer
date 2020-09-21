import React, { useState } from "react";

import { TableRow, TableCell, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import SeriesMetadataTable from "./SeriesMetadataTable";

const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  },
  collapsedCell: {
    padding: 0
  }
});

export default function TableRowCollapsed({ row, columns }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const renderSeriesName = columns[0].render;

  return (
    <>
      <TableRow key={row.SERCODIGO} className={classes.root}>
        <TableCell key="name">{renderSeriesName(row)}</TableCell>
        <TableCell key="collapse" align="right">
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
          <Collapse in={open} unmountOnExit>
            <SeriesMetadataTable metadata={row} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
