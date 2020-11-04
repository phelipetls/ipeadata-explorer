import React from "react";

import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";

export function SelectGeoBoundary(props) {
  const { geoBoundary, geoBoundaries, handleChange } = props;

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
          {geoBoundaries.map(boundary => (
            <option key={boundary} value={boundary}>
              {boundary}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grow>
  );
}
