import React from "react";

import { Select, InputLabel, FormControl } from "@material-ui/core";

export function SelectGeoDivisions(props) {
  const { geoDivision, geoDivisions, handleChange, ...rest } = props;

  return (
    <FormControl required variant="outlined">
      <InputLabel htmlFor="geoDivision" shrink>
        Divisões geográficas
      </InputLabel>

      <Select
        {...rest}
        native
        value={geoDivision}
        label="Divisões geográficas"
        onChange={handleChange}
        inputProps={{ name: "geoDivision", id: "geoDivision" }}
      >
        {geoDivisions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
