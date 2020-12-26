import React, { useState } from "react";

import { BoundaryDivision, SeriesDivision, shouldPlotMap } from "api/ibge";
import {
  SelectGeographicDivision,
  SelectGeographicBoundaryDivision,
  SelectGeographicBoundaryId,
} from "./components";

interface Props {
  division: SeriesDivision;
  divisions: SeriesDivision[];
}

export function GeographyInputs(props: Props) {
  const [division, setDivisions] = useState<SeriesDivision>(props.division);
  const [boundaryDivision, setBoundaryDivision] = useState<BoundaryDivision>(
    "Brasil"
  );

  return (
    <>
      <SelectGeographicDivision
        division={props.division}
        divisions={props.divisions}
        handleChange={e => setDivisions(e.target.value as SeriesDivision)}
      />

      {shouldPlotMap(division) && (
        <>
          <SelectGeographicBoundaryDivision
            division={division}
            boundaryDivision={boundaryDivision}
            handleChange={e =>
              setBoundaryDivision(e.target.value as BoundaryDivision)
            }
          />

          {boundaryDivision !== "Brasil" ? (
            <SelectGeographicBoundaryId boundaryDivision={boundaryDivision} />
          ) : null}
        </>
      )}
    </>
  );
}
