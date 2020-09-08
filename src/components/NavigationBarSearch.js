import React, { useState } from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import BackButton from "./BackButton";

const useStyles = makeStyles(theme => ({
  searchContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  search: {
    padding: "0 1em"
  }
}));

export default function NavigationBarSearch(props) {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = e => {
    setSearchInput(e.target.value);
  };

  const handleEscape = e => {
    if (e.key === "Escape") {
      e.target.value = "";
      e.target.blur();
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.searchContainer}>
      <TextField
        value={searchInput}
        onChange={handleChange}
        className={classes.search}
        onKeyDown={handleEscape}
        onBlur={props.onBlur}
        placeholder="Pesquisar..."
        type="search"
        autoFocus
        fullWidth
        InputProps={{
          disableUnderline: true,
          startAdornment: <BackButton onClick={props.handleBlur} />
        }}
      />
    </div>
  );
}
