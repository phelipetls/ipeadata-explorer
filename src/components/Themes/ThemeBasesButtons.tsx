import React from "react";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import { theme } from "styles/Theme"
import { makeStyles } from "@material-ui/styles";

import { BaseType } from "./types"

const useStyles = makeStyles(({
  buttonsGroup: {
    display: "flex",
    margin: "2em 0",
    justifyContent: "center",
  },
  macro: {
    color: theme.palette.macro,
  },
  regional: {
    color: theme.palette.regional,
  },
  social: {
    color: theme.palette.social,
  },
}));

interface Props {
  bases: BaseType[],
  onChange: (_: any, bases: BaseType[]) => void,
}

export function ThemeBasesButtons({ bases, onChange }: Props) {
  const classes = useStyles();

  return (
    <ToggleButtonGroup
      value={bases}
      onChange={onChange}
      size="large"
      className={classes.buttonsGroup}
    >
      <ToggleButton value="MACRO" classes={{ label: classes.macro }}>
        Macroeconômico
      </ToggleButton>
      <ToggleButton value="REGIONAL" classes={{ label: classes.regional }}>
        Regional
      </ToggleButton>
      <ToggleButton value="SOCIAL" classes={{ label: classes.social }}>
        Social
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
