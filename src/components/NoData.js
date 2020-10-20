import React from "react";

import { Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";

import Center from "./Center";

export default function NoData({ style }) {
  return (
    <Center style={style}>
      <Error fontSize="large" />
      <Typography variant="h6">Sem dados</Typography>
    </Center>
  );
}
