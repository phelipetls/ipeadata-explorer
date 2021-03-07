import {
  FormControl,
  Grow,
  InputLabel,
  Select,
  SelectProps,
} from "@material-ui/core";
import {
  DivisionToPlotAsMap,
  getContainingDivisions,
  IbgeMapDivision,
} from "api/ibge";
import * as React from "react";
import { Ref } from "react-hook-form";

type Props = Pick<SelectProps, "name"> & {
  division: DivisionToPlotAsMap;
  boundaryDivision: IbgeMapDivision;
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
};

export const SelectGeographicBoundaryDivision = React.forwardRef<Ref, Props>(
  (props, ref) => {
    const { name, division, boundaryDivision, handleChange } = props;

    const boundaries = getContainingDivisions(division);

    return (
      <Grow in={true}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="boundary-division" shrink>
            Limite geográfico
          </InputLabel>

          <Select
            native
            inputRef={ref}
            value={boundaryDivision}
            label="Limite geográfico"
            onChange={handleChange}
            inputProps={{ name, id: "boundary-division" }}
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
);
