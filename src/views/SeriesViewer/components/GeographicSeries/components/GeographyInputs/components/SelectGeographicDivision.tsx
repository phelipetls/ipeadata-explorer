import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
} from "@material-ui/core";
import { GeographicDivision } from "api/ibge";
import * as React from "react";
import { Ref } from "react-hook-form";

type Props = Pick<SelectProps, "name"> & {
  division: GeographicDivision;
  divisions: GeographicDivision[];
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
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </Select>
      </FormControl>
    );
  }
);
