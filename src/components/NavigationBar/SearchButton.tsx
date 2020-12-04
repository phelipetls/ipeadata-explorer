import React from "react";

import { IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";

export function SearchButton(props) {
  return (
    <IconButton
      color="default"
      onClick={props.onClick}
      style={{ alignSelf: "center" }}
      type={props.type || "button"}
    >
      <Search />
    </IconButton>
  );
}
