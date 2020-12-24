import * as React from "react";

import { ArrowBack } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export interface Props {
  onClick: () => void
}

export function BackButton(props: Props) {
  return (
    <IconButton color="default" onClick={props.onClick}>
      <ArrowBack />
    </IconButton>
  );
}
