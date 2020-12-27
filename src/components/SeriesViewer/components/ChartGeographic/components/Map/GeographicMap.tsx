import * as React from "react";

import { ChoroplethMap, MapTooltip } from "./components";
import { IbgeMapDivision } from "api/ibge";
import { SeriesMetadata, SeriesValues } from "components/types";

interface tooltipPositionType {
  x: number | undefined;
  y: number | undefined;
}

interface Props {
  series: SeriesValues[];
  metadata: SeriesMetadata;
  division: IbgeMapDivision;
  boundaryId: string;
}

export const GeographicMap: React.FC<Props> = props => {
  const [tooltipText, setTooltipText] = React.useState("");
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState<
    tooltipPositionType
  >({
    x: undefined,
    y: undefined,
  });

  return (
    <>
      <ChoroplethMap
        {...props}
        setTooltipPosition={setTooltipPosition}
        setTooltipText={setTooltipText}
        setTooltipOpen={setTooltipOpen}
      />

      <MapTooltip
        position={tooltipPosition}
        open={tooltipOpen}
        title={tooltipText}
      >
        <div />
      </MapTooltip>
    </>
  );
};
