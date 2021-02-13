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

import { Loading } from "components";
import { fetchDivisionNames, IbgeDivisionEndpoint } from "api/ibge";
import { unpluralize } from "utils";

type Props = Pick<SelectProps, "name"> & {
  boundaryDivision: IbgeDivisionEndpoint;
  defaultBoundaryId: string;
};

export const SelectGeographicBoundaryId = React.forwardRef<Ref, Props>(
  (props, ref) => {
    const { name, defaultBoundaryId, boundaryDivision } = props;

    const { isLoading, data = [] } = useQuery(
      ["Fetch geographic divisions names", boundaryDivision],
      (_: string, boundaryDivision: IbgeDivisionEndpoint) =>
        fetchDivisionNames(boundaryDivision)
    );

    if (isLoading) {
      return <Loading />;
    }

    const boundaries = data.map(boundary => ({
      id: boundary.id,
      name: boundary.nome,
    }));

    const defaultValue =
      boundaries.find(
        boundary =>
          boundary.name === defaultBoundaryId ||
          boundary.id === Number(defaultBoundaryId)
      )?.id || boundaries[0].id;

    return (
      <Grow in={true}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="boundary-id" shrink>
            {unpluralize(boundaryDivision)}
          </InputLabel>

          <Select
            native
            inputRef={ref}
            defaultValue={defaultValue}
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
