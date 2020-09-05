import React from "react";

import { CircularProgress } from "@material-ui/core";

export default function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  );
}
