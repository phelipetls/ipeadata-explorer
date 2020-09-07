import React, { useState } from "react";

import { Typography, Paper, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

export default function Collapsed(props) {
  const [open, setOpen] = useState(false);

  return (
    <Paper>
      <Typography variant="h5">
        {props.label}
        <IconButton
          aria-label="Expande filtros"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Typography>

      <Collapse in={open}>{props.children}</Collapse>
    </Paper>
  );
}
