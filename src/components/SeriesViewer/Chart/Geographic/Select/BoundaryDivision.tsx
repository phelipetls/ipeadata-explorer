import React from "react";

import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";
import { divisionType } from "../api/ibge";

interface Props {
  boundaries: divisionType[],
  boundaryDivision: divisionType,
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void
}

export function SelectBoundaryDivision(props: Props) {
  const { boundaries, boundaryDivision, handleChange } = props;

  return (
    <Grow in={true}>
      <FormControl variant="outlined">
        <InputLabel htmlFor="boundaryDivision" shrink>
          Limite geográfico
        </InputLabel>

        <Select
          native
          value={boundaryDivision}
          label="Limite geográfico"
          onChange={handleChange}
          inputProps={{ name: "boundaryDivision", id: "boundaryDivision" }}
        >
          {boundaries.map(boundary => (
            <option key={boundary} value={boundary}>
              {boundary}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grow>
  );
}
