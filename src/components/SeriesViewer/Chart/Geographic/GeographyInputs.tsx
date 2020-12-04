import React, { useState } from "react";

import { shouldPlotMap, getContainingDivisions } from "./api/ibge";

import { SelectGeographicDivisions } from "./Select/GeographicDivisions";
import { SelectBoundaryDivision } from "./Select/BoundaryDivision";
import { SelectBoundaryId } from "./Select/BoundaryId";

export function GeographyInputs(props) {
  const [division, setDivisions] = useState(null);
  const [boundaryDivision, setBoundaryDivision] = useState("Brasil");

  const possibleBoundaries = getContainingDivisions(division || props.division);

  return (
    <>
      <SelectGeographicDivisions
        defaultValue={props.division}
        divisions={props.divisions}
        handleChange={e => setDivisions(e.target.value)}
      />

      {shouldPlotMap(division || props.division) && (
        <>
          <SelectBoundaryDivision
            boundaries={possibleBoundaries}
            boundaryDivision={boundaryDivision}
            handleChange={e => setBoundaryDivision(e.target.value)}
          />

          {boundaryDivision !== "Brasil" && (
            <SelectBoundaryId boundaryDivision={boundaryDivision} />
          )}
        </>
      )}
    </>
  );
}
