import React, { useState } from "react";

import {
  mapBoundaryType,
  seriesDivisionType,
  shouldPlotMap,
  getContainingDivisions,
} from "api/ibge";

import {
  SelectGeographicDivision,
  SelectGeographicBoundaryDivision,
  SelectGeographicBoundaryId,
} from "./components";

interface Props {
  division: seriesDivisionType;
  divisions: seriesDivisionType[];
}

export function GeographyInputs(props: Props) {
  const [division, setDivisions] = useState<seriesDivisionType>(props.division);
  const [boundaryDivision, setBoundaryDivision] = useState<mapBoundaryType>(
    "Brasil"
  );

  return (
    <>
      <SelectGeographicDivision
        division={props.division}
        divisions={props.divisions}
        handleChange={e => setDivisions(e.target.value as seriesDivisionType)}
      />

      {shouldPlotMap(division) && (
        <>
          <SelectGeographicBoundaryDivision
            division={division}
            boundaryDivision={boundaryDivision}
            handleChange={e =>
              setBoundaryDivision(e.target.value as mapBoundaryType)
            }
          />

          {boundaryDivision !== "Brasil" && (
            <SelectGeographicBoundaryId boundaryDivision={boundaryDivision} />
          )}
        </>
      )}
    </>
  );
}
