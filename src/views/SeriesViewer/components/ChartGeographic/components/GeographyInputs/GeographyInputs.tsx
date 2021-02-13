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
  boundaryDivision: BoundaryDivision | null;
  boundaryId: string;
}

export interface GeographyInputsData {
  division: SeriesDivision;
  boundaryDivision: BoundaryDivision;
  boundaryId: string;
}

export function GeographyInputs(props: Props) {
  const {
    division: defaultDivision,
    divisions,
    boundaryDivision: defaultBoundaryDivision,
    boundaryId: defaultBoundaryId,
  } = props;

  const { register } = useFormContext<GeographyInputsData>();

  const [division, setDivision] = React.useState<SeriesDivision>(
    defaultDivision
  );

  const [boundaryDivision, setBoundaryDivision] = React.useState<
    BoundaryDivision
  >(defaultBoundaryDivision || "Brasil");

  return (
    <>
      <SelectGeographicDivision
        ref={register}
        name="division"
        division={defaultDivision}
        divisions={divisions}
        handleChange={e => setDivision(e.target.value as SeriesDivision)}
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

          {boundaryDivision !== "Brasil" && (
            <SelectGeographicBoundaryId
              ref={register}
              name="boundaryId"
              boundaryDivision={boundaryDivision}
              defaultBoundaryId={defaultBoundaryId}
            />
          )}
        </>
      )}
    </>
  );
}
