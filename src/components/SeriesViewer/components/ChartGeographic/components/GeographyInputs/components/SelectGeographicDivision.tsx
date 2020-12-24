import React from "react";

import { Select, InputLabel, FormControl } from "@material-ui/core";
import { seriesDivisionType } from "api/ibge";

interface Props {
  division: seriesDivisionType,
  divisions: seriesDivisionType[],
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void
}

export function SelectGeographicDivision(props: Props) {
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
