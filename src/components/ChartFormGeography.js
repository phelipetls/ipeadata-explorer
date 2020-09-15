import React, { useState } from "react";
import { Select, InputLabel, FormControl } from "@material-ui/core";

export default function ChartFormGeography(props) {
  const [geoLevel, setGeoLevel] = useState(props.geoLevel);

  return (
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
        {props.geoLevels.map(level => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
