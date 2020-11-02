import React from "react";

import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";

import { getContainingRegions } from "../api/ibge";

export function SelectGeoBoundary(props) {
  const { geoDivision, geoBoundary, handleChange } = props;

  return (
    <Grow in={true}>
      <FormControl variant="outlined">
        <InputLabel htmlFor="geoBoundary" shrink>
          Limite geográfico
        </InputLabel>

        <Select
          native
          value={geoBoundary}
          label="Limite geográfico"
          onChange={handleChange}
          inputProps={{ name: "geoBoundary", id: "geoBoundary" }}
        >
          {getContainingRegions(geoDivision).map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grow>
  );
}
