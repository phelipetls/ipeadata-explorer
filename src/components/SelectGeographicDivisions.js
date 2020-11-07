import React from "react";

import { Select, InputLabel, FormControl } from "@material-ui/core";

export function SelectGeographicDivisions(props) {
  const { divisions, handleChange, ...rest } = props;

  return (
    <FormControl required variant="outlined">
      <InputLabel htmlFor="division" shrink>
        Divisões geográficas
      </InputLabel>

      <Select
        {...rest}
        native
        label="Divisões geográficas"
        onChange={handleChange}
        inputProps={{ name: "division", id: "division" }}
      >
        {divisions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
