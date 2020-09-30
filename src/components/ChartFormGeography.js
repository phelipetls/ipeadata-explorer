import React, { useState } from "react";
import { Select, InputLabel, FormControl } from "@material-ui/core";

export default function ChartFormGeography(props) {
  const [geoDivision, setGeoDivision] = useState(props.geoDivision);

  return (
    <>
      <FormControl required variant="outlined">
        <InputLabel htmlFor="geoDivision" shrink>
          Divisão geográfica
        </InputLabel>
        <Select
          native
          value={geoDivision}
          label="Divisão geográfica"
          onChange={e => setGeoDivision(e.target.value)}
          inputProps={{ name: "geoDivision", id: "geoDivision" }}
        >
          {props.geoDivisions.map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
