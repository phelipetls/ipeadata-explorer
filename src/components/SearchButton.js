import React from "react";

import { IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";

export default function SearchButton(props) {
  return (
    <IconButton
      color="default"
      onClick={props.onClick}
      style={{ alignSelf: "center" }}
    >
      <Search />
    </IconButton>
  );
}
