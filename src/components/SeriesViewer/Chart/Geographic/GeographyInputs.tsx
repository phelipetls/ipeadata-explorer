import React, { useState } from "react";

import {
  divisionType,
  shouldPlotMap,
  getContainingDivisions,
} from "./api/ibge";

import { SelectGeographicDivisions } from "./Select/GeographicDivisions";
import { SelectBoundaryDivision } from "./Select/BoundaryDivision";
import { SelectBoundaryId } from "./Select/BoundaryId";

interface Props {
  division: divisionType;
  divisions: divisionType[];
}

export function GeographyInputs(props: Props) {
  const [division, setDivisions] = useState<divisionType | null>(null);
  const [boundaryDivision, setBoundaryDivision] = useState<divisionType>(
    "Brasil"
  );

  const possibleBoundaryDivisions = getContainingDivisions(division || props.division);

  return (
    <>
      <SelectGeographicDivisions
        division={props.division}
        divisions={props.divisions}
        handleChange={e => setDivisions(e.target.value as divisionType)}
      />

      {shouldPlotMap(division || props.division) && (
        <>
          <SelectBoundaryDivision
            boundaries={possibleBoundaryDivisions}
            boundaryDivision={boundaryDivision}
            handleChange={e =>
              setBoundaryDivision(e.target.value as divisionType)
            }
          />

          {boundaryDivision !== "Brasil" && (
            <SelectBoundaryId boundaryDivision={boundaryDivision} />
          )}
        </>
      )}
    </>
  );
}
