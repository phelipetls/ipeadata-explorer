import React, { useState } from "react";

import { TableCell, TableRow, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import SeriesMetadataTable from "./SeriesMetadataTable";

const useStyles = makeStyles((theme) => ({
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  collapsedCell: {
    paddingBottom: 0,
  },
  metadataCell: {
    paddingBottom: theme.spacing(2),
  }
}));

export default function TableRowCollapsed({ row, columns }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const renderSeriesName = columns[0].render;

  return (
    <>
      <TableRow key={row.SERCODIGO} className={classes.row}>
        <TableCell key="name">{renderSeriesName(row)}</TableCell>
        <TableCell key="collapse" align="right" className={classes.collapsedCell}>
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
        <TableCell colSpan={2}>
          <Collapse in={open} className={classes.metadataCell} unmountOnExit>
            <SeriesMetadataTable metadata={row} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
