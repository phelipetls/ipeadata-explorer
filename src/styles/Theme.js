import { colors } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    "macro": colors.blue[600],
    "regional": colors.green[600],
    "social": colors.red[600],
  },
  link: {
    textDecoration: "none",
  }
})
