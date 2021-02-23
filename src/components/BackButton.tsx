import * as React from "react";

import { ArrowBack } from "@material-ui/icons";
import { IconButton, IconButtonProps } from "@material-ui/core";

interface Props {
  onClick: () => void;
}

export function BackButton({ onClick, ...rest }: Props & IconButtonProps) {
  return (
    <IconButton color="default" onClick={onClick} {...rest}>
      <ArrowBack />
    </IconButton>
  );
}
