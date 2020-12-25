import React from "react";

import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";
import { getContainingDivisions, MapDivision, IbgeMapDivision } from "api/ibge";

interface Props {
  division: MapDivision;
  boundaryDivision: IbgeMapDivision;
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
}

export function SelectGeographicBoundaryDivision(props: Props) {
  const { division, boundaryDivision, handleChange } = props;

  const boundaries = getContainingDivisions(division);

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
