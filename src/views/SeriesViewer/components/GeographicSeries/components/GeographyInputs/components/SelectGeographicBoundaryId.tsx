import {
  FormControl,
  Grow,
  InputLabel,
  Select,
  SelectProps,
} from "@material-ui/core";
import { fetchDivisionTerritories, IbgeLocationDivision } from "api/ibge";
import { Loading } from "components";
import * as React from "react";
import { Ref } from "react-hook-form";
import { useQuery } from "react-query";
import { unpluralize } from "utils";

type Props = Pick<SelectProps, "name"> & {
  boundaryDivision: IbgeLocationDivision;
  defaultBoundaryId: string;
};

export const SelectGeographicBoundaryId = React.forwardRef<Ref, Props>(
  (props, ref) => {
    const { name, defaultBoundaryId, boundaryDivision } = props;

    const { isLoading, data = [] } = useQuery(
      ["Fetch boundary division territories", boundaryDivision],
      () => fetchDivisionTerritories(boundaryDivision)
    );

    if (isLoading) {
      return <Loading />;
    }

    const boundaries = data.map((boundary) => ({
      id: boundary.id,
      name: boundary.nome,
    }));

    const defaultValue =
      boundaries.find(
        (boundary) =>
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
            {boundaries.map((boundary) => (
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
