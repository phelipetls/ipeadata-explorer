import React, { useState } from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { BackButton } from "./BackButton";
import { SearchButton } from "./SearchButton";

const useStyles = makeStyles(() => ({
  searchContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    padding: "0 1em",
  },
}));

export function NavigationBarSearch(props) {
  const classes = useStyles();

  const [searchInput, setSearchInput] = useState("");

  const handleChange = e => {
    setSearchInput(e.target.value);
  };

  const handleEscape = e => {
    if (e.key === "Escape") {
      e.target.value = "";
      props.searchExit();
    }
  };

  return (
    <form action="/series" className={classes.searchContainer}>
      <TextField
        value={searchInput}
        name="SERNOME"
        onChange={handleChange}
        className={classes.search}
        onKeyDown={handleEscape}
        placeholder="Pesquisar..."
        type="search"
        autoFocus
        fullWidth
        InputProps={{
          disableUnderline: true,
          startAdornment: <BackButton onClick={props.searchExit} />,
          endAdornment: <SearchButton type="submit" />,
        }}
      />
    </form>
  );
}
