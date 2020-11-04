import React, { useState } from "react";

import { ChartChoroplethMap } from "./ChartChoroplethMap.js";
import { MapTooltip } from "./MapTooltip.js";

export const ChartGeographicMap = props => {
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: undefined,
    y: undefined,
  });

  return (
    <>
      <ChartChoroplethMap
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
