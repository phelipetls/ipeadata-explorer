import React, { useState } from "react";

import { ChoroplethMap } from "./ChoroplethMap.js";
import { MapTooltip } from "./Tooltip.js";

export const Map = props => {
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
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
