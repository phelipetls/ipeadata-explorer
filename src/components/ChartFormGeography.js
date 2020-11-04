import React, { useState } from "react";

import { getChartType, getContainingDivisions } from "../api/ibge";

import { SelectGeographicDivisions } from "./SelectGeographicDivisions";
import { SelectBoundaryDivision } from "./SelectBoundaryDivision";
import { SelectBoundaryId } from "./SelectBoundaryId";

export function ChartFormGeography(props) {
  const [division, setDivisions] = useState(null);
  const [boundaryDivision, setBoundaryDivision] = useState("Brasil");

  const boundaries = getContainingDivisions(division || props.division);

  return (
    <>
      <SelectGeographicDivisions
        defaultValue={props.division}
        divsion={division}
        divisions={props.divisions}
        handleChange={e => setDivisions(e.target.value)}
      />

      {getChartType(division || props.division) === "map" && (
        <>
          <SelectBoundaryDivision
            boundaries={boundaries}
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
