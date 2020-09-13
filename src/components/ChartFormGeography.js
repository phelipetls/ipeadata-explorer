import React, { useState } from "react";
import { Select, InputLabel, FormControl } from "@material-ui/core";

export default function ChartFormGeography({ geoLevels }) {
  const [geoLevel, setGeoLevel] = useState(geoLevels[0]);

  return (
    geoLevels.length > 0 && (
      <FormControl required variant="outlined">
        <InputLabel htmlFor="geoLevel" shrink>
          Nível geográfico
        </InputLabel>
        <Select
          native
          value={geoLevel}
          label="Nível geográfico"
          onChange={e => setGeoLevel(e.target.value)}
          inputProps={{ name: "geoLevel", id: "geoLevel" }}
        >
          {geoLevels.map(level => (
            <option value={level}>{level}</option>
          ))}
        </Select>
      </FormControl>
    )
  );
}
