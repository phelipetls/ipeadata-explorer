import React, { useState } from "react";

import { useQuery } from "react-query";
import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";
import { unpluralize, getDivisionsUrl } from "../api/ibge";

import { Loading } from "./Loading";

async function fetchGeoBoundaryIds(boundary) {
  const url = getDivisionsUrl(boundary);
  const boundaries = await (await fetch(url)).json();

  return boundaries.map(boundary => ({
    id: boundary.id,
    name: boundary.nome,
  }));
}

export function SelectGeoBoundaryId({ geoBoundary }) {
  let [geoBoundaryId, setGeoBoundaryId] = useState(null);

  const { isLoading, data: geoBoundaryIds = [] } = useQuery(
    [geoBoundary],
    fetchGeoBoundaryIds
  );

  geoBoundaryId = geoBoundaryId || geoBoundaryIds[0];

  if (isLoading) return <Loading />;

  return (
    <Grow in={true}>
      <FormControl variant="outlined">
        <InputLabel htmlFor="geoBoundaryId" shrink>
          {unpluralize(geoBoundary)}
        </InputLabel>

        <Select
          native
          value={geoBoundaryId}
          label={unpluralize(geoBoundary)}
          onChange={e => setGeoBoundaryId(e.target.value)}
          inputProps={{
            name: "geoBoundaryId",
            id: "geoBoundaryId",
          }}
        >
          {geoBoundaryIds.map(boundary => (
            <option key={boundary.name} value={boundary.id}>
              {boundary.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </Grow>
  );
}
