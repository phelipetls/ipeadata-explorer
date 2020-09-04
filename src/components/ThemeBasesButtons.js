import React from "react";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  buttonsGroup: {
    display: "flex",
    margin: "2em 0",
    justifyContent: "center"
  },
  macro: {
    color: theme.palette.macro
  },
  regional: {
    color: theme.palette.regional
  },
  social: {
    color: theme.palette.social
  }
}));

export default function ThemeBasesButtons(props) {
  const classes = useStyles();

  return (
    <ToggleButtonGroup
      value={props.value}
      onChange={props.onChange}
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
