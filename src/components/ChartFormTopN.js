import React, { useState } from "react";

import { TextField } from "@material-ui/core";

export default function ChartFormTopN(props) {
  const [topN, setTopN] = useState("");

  return (
    <TextField
      type="number"
      value={topN}
      name="topN"
      onChange={e => setTopN(e.target.value)}
      variant="outlined"
      label="Top N"
    />
  );
}
