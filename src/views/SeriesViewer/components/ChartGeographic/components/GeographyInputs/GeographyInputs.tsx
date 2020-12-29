import * as React from "react";
import { useFormContext } from "react-hook-form";

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

export interface GeographyInputsData {
  division: SeriesDivision;
  boundaryDivision: BoundaryDivision;
  boundaryId: string;
}

export function GeographyInputs(props: Props) {
  const { register } = useFormContext<GeographyInputsData>();

  const [division, setDivisions] = React.useState<SeriesDivision>(
    props.division
  );
  const [boundaryDivision, setBoundaryDivision] = React.useState<
    BoundaryDivision
  >("Brasil");

  return (
    <>
      <SelectGeographicDivision
        ref={register}
        name="division"
        division={props.division}
        divisions={props.divisions}
        handleChange={e => setDivisions(e.target.value as SeriesDivision)}
      />

      {shouldPlotMap(division) && (
        <>
          <SelectGeographicBoundaryDivision
            ref={register}
            name="boundaryDivision"
            division={division}
            boundaryDivision={boundaryDivision}
            handleChange={e =>
              setBoundaryDivision(e.target.value as BoundaryDivision)
            }
          />

          {boundaryDivision !== "Brasil" ? (
            <SelectGeographicBoundaryId
              ref={register}
              name="boundaryId"
              boundaryDivision={boundaryDivision}
            />
          ) : null}
        </>
      )}
    </>
  );
}
