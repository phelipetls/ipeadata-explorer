import React from "react";

import { useQuery } from "react-query";
import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";
import { unpluralize, getDivisionsUrl } from "../api/ibge";

import { Loading } from "./Loading";

async function getDivisionsNames(_, division) {
  const url = getDivisionsUrl(division);
  return await (await fetch(url)).json();
}

export function SelectBoundaryId({ boundaryDivision }) {
  const { isLoading, data = [] } = useQuery(
    ["Fetch geographic divisions names", boundaryDivision],
    getDivisionsNames
  );

  if (isLoading) return <Loading />;

  const boundaries = data.map(boundary => ({
    id: boundary.id,
    name: boundary.nome,
  }));

  return (
    <Grow in={true}>
      <FormControl variant="outlined">
        <InputLabel htmlFor="boundaryId" shrink>
          {unpluralize(boundaryDivision)}
        </InputLabel>

        <Select
          native
          defaultValue={boundaries[0]}
          label={unpluralize(boundaryDivision)}
          inputProps={{
            name: "boundaryId",
            id: "boundaryId",
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
