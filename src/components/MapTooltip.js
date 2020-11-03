import React from "react";

import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const StyledTooltip = withStyles(() => ({
  tooltip: {
    fontSize: 13,
  },
}))(Tooltip);

export function MapTooltip({ position, children, ...props }) {
  return (
    <StyledTooltip
      {...props}
      PopperProps={{
        anchorEl: {
          clientHeight: 0,
          clientWidth: 0,
          getBoundingClientRect: () => ({
            top: position.y,
            left: position.x,
            right: position.x,
            bottom: position.y,
            width: 0,
            height: 0,
          }),
        },
      }}
    >
      {children}
    </StyledTooltip>
  );
}
