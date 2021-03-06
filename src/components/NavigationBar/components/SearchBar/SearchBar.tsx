import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BackButton, SearchButton } from "components";
import * as React from "react";

const useStyles = makeStyles(() => ({
  form: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: "0 1em",
  },
}));

interface Props {
  deactivateSearch: () => void;
}

export function SearchBar({ deactivateSearch }: Props) {
  const classes = useStyles();

  const [searchInput, setSearchInput] = React.useState("");

  const handleChange = (e: React.ChangeEvent) => {
    const element = e.target as HTMLInputElement;
    setSearchInput(element.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      deactivateSearch();

      const element = e.target as HTMLInputElement;
      element.value = "";
    }
  };

  return (
    <form action="/series" className={classes.form}>
      <TextField
        value={searchInput}
        name="SERNOME"
        onChange={handleChange}
        className={classes.input}
        onKeyDown={handleKeyDown}
        placeholder="Pesquisar..."
        type="search"
        autoFocus
        fullWidth
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <BackButton
              onClick={deactivateSearch}
              data-testid="search-back-button"
            />
          ),
          endAdornment: <SearchButton type="submit" />,
        }}
      />
    </form>
  );
}
