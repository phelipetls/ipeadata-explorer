import React, { useState } from "react";

import { Typography, Paper, Collapse, IconButton } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

interface Props {
  label: string;
  children: JSX.Element;
}

export function Collapsed({ label, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Paper>
      <Typography variant="h5">
        {label}
        <IconButton
          aria-label="Expande filtros"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Typography>

      <Collapse in={open}>{children}</Collapse>
    </Paper>
  );
}
