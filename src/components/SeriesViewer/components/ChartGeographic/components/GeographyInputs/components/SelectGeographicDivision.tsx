import React from "react";
import { useFormContext } from "react-hook-form";

import { Select, InputLabel, FormControl } from "@material-ui/core";
import { SeriesDivision } from "api/ibge";

interface Props {
  division: SeriesDivision;
  divisions: SeriesDivision[];
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
}

export function SelectGeographicDivision(props: Props) {
  const { register } = useFormContext();
  const { division, divisions, handleChange } = props;

  return (
    <FormControl required variant="outlined">
      <InputLabel htmlFor="division" shrink>
        Divisões geográficas
      </InputLabel>

      <Select
        native
        inputRef={register}
        defaultValue={division}
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
