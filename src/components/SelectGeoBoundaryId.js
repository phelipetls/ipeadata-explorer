import React from "react";

import { useQuery } from "react-query";
import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";
import { unpluralize, getDivisionsUrl } from "../api/ibge";

import { Loading } from "./Loading";

export function SelectGeoBoundaryId({ geoBoundary }) {
  const { isLoading, data = [] } = useQuery(
    ["Get all names of a", geoBoundary],
    async () => {
      const url = getDivisionsUrl(geoBoundary);
      return await (await fetch(url)).json();
    }
  );

  if (isLoading) return <Loading />;

  const boundaries = data.map(boundary => ({
    id: boundary.id,
    name: boundary.nome,
  }));

  return (
    <Grow in={true}>
      <FormControl variant="outlined">
        <InputLabel htmlFor="geoBoundaryId" shrink>
          {unpluralize(geoBoundary)}
        </InputLabel>

        <Select
          native
          defaultValue={boundaries[0]}
          label={unpluralize(geoBoundary)}
          inputProps={{
            name: "geoBoundaryId",
            id: "geoBoundaryId",
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
