import React from "react";

import { Select, InputLabel, FormControl } from "@material-ui/core";
import { divisionType } from "../api/ibge";

interface Props {
  division: divisionType,
  divisions: divisionType[],
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void
}

export function SelectGeographicDivisions(props: Props) {
  const { division, divisions, handleChange } = props;

  return (
    <FormControl required variant="outlined">
      <InputLabel htmlFor="division" shrink>
        Divisões geográficas
      </InputLabel>

      <Select
        defaultValue={division}
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
