import React, { useState } from "react";

import { ChoroplethMap } from "./ChoroplethMap";
import { MapTooltip } from "./Tooltip";

import { divisionType } from "../api/ibge";
import { SeriesMetadata, SeriesValues } from "components/types";

interface tooltipPositionType {
  x: number | undefined,
  y: number | undefined,
}

interface Props {
  series: SeriesValues[];
  metadata: SeriesMetadata;
  division: divisionType;
  boundaryId: string;
}

export const Map: React.FC<Props> = props => {
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<tooltipPositionType>({
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
