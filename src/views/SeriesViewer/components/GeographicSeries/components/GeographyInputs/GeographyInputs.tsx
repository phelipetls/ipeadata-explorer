import { BoundaryDivision, GeographicDivision, shouldPlotMap } from "api/ibge";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  SelectGeographicBoundaryDivision,
  SelectGeographicBoundaryId,
  SelectGeographicDivision,
} from "./components";

interface Props {
  division: GeographicDivision;
  divisions: GeographicDivision[];
  boundaryDivision?: BoundaryDivision | null;
  boundaryId?: string;
}

export interface GeographyInputsData {
  division: GeographicDivision;
  boundaryDivision: BoundaryDivision;
  boundaryId: string;
}

export function GeographyInputs(props: Props) {
  const {
    division: defaultDivision,
    divisions,
    boundaryDivision: defaultBoundaryDivision,
    boundaryId: defaultBoundaryId = "BR",
  } = props;

  const { register } = useFormContext<GeographyInputsData>();

  const [division, setDivision] =
    React.useState<GeographicDivision>(defaultDivision);

  const [boundaryDivision, setBoundaryDivision] =
    React.useState<BoundaryDivision>(defaultBoundaryDivision || "Brasil");

  return (
    <>
      <SelectGeographicDivision
        ref={register}
        name="division"
        division={defaultDivision}
        divisions={divisions}
        handleChange={(e) => setDivision(e.target.value as GeographicDivision)}
      />

      {shouldPlotMap(division) && (
        <>
          <SelectGeographicBoundaryDivision
            ref={register}
            name="boundaryDivision"
            division={division}
            boundaryDivision={boundaryDivision}
            handleChange={(e) =>
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
