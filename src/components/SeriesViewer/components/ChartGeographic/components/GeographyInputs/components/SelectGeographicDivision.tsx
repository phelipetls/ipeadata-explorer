import React from "react";
import { Ref } from "react-hook-form";

import {
  Select,
  SelectProps,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { SeriesDivision } from "api/ibge";

type Props = Pick<SelectProps, "name"> & {
  division: SeriesDivision;
  divisions: SeriesDivision[];
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
};

export const SelectGeographicDivision = React.forwardRef<Ref, Props>(
  (props, ref) => {
    const { name, division, divisions, handleChange } = props;

    return (
      <FormControl required variant="outlined">
        <InputLabel htmlFor="division" shrink>
          Divisões geográficas
        </InputLabel>

        <Select
          native
          inputRef={ref}
          defaultValue={division}
          label="Divisões geográficas"
          onChange={handleChange}
          inputProps={{ name, id: "division" }}
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
);
