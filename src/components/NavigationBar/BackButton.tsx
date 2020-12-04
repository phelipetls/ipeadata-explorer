import React from "react";

import { ArrowBack } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export function BackButton(props) {
  return (
    <IconButton color="default" onClick={props.onClick}>
      <ArrowBack />
    </IconButton>
  );
}
