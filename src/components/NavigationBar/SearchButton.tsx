import * as React from "react";

import { IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";

interface Props {
  activateSearch: () => void;
}

export function SearchButton({ activateSearch, ...props }: Props) {
  const handleClick = () => activateSearch();

  return (
    <IconButton
      color="default"
      onClick={handleClick}
      style={{ alignSelf: "center" }}
      type="button"
      {...props}
    >
      <Search />
    </IconButton>
  );
}
