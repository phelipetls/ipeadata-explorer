import * as React from "react";
import { Ref } from "react-hook-form";

import { useQuery } from "react-query";
import {
  Select,
  SelectProps,
  InputLabel,
  FormControl,
  Grow,
} from "@material-ui/core";

import { Loading } from "components/common";
import {
  unpluralize,
  getDivisionsMetadata,
  BoundaryDivisionToSelect,
} from "api/ibge";

type Props = Pick<SelectProps, "name"> & {
  boundaryDivision: BoundaryDivisionToSelect;
};

export const SelectGeographicBoundaryId = React.forwardRef<Ref, Props>(
  (props, ref) => {
    const { name, boundaryDivision } = props;

    const { isLoading, data = [] } = useQuery(
      ["Fetch geographic divisions names", boundaryDivision],
      (_: string, boundaryDivision: BoundaryDivisionToSelect) =>
        getDivisionsMetadata(boundaryDivision)
    );

    if (isLoading) return <Loading />;

    const boundaries = data.map(boundary => ({
      id: boundary.id,
      name: boundary.nome,
    }));

    return (
      <Grow in={true}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="boundary-id" shrink>
            {unpluralize(boundaryDivision)}
          </InputLabel>

          <Select
            native
            inputRef={ref}
            defaultValue={boundaries[0]}
            label={unpluralize(boundaryDivision)}
            inputProps={{
              name,
              id: "boundary-id",
            }}
          >
            {boundaries.map(boundary => (
              <option key={boundary.name} value={boundary.id}>
                {boundary.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grow>
    );
  }
);
