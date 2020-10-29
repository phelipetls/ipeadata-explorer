import React, { useState } from "react";

import { KeyboardDatePicker } from "@material-ui/pickers";

export function StyledKeyboardDatePicker(props) {
  const [date, setDate] = useState(null);

  return (
    <KeyboardDatePicker
      {...props}
      value={date}
      onChange={setDate}
      inputVariant="outlined"
      format="dd/MM/yyyy"
      mask="__/__/____"
      clearable
    />
  );
}
