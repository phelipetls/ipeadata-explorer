import React, { useState } from "react";

import {
  KeyboardDatePicker as MuiKeyboardDatePicker,
  KeyboardDatePickerProps,
} from "@material-ui/pickers";

type PartialKeyboardDatePickerProps = Partial<KeyboardDatePickerProps>;

export const KeyboardDatePicker: React.FC<PartialKeyboardDatePickerProps> = React.forwardRef(
  (props, ref) => {
    // FIXME: may not need this
    const [date, setDate] = useState<Date | null>(null);

    return (
      <MuiKeyboardDatePicker
        {...props}
        inputRef={ref}
        value={date}
        onChange={setDate}
        inputVariant="outlined"
        format="dd/MM/yyyy"
        mask="__/__/____"
        clearable
      />
    );
  }
);
