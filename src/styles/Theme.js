import { blue, green, red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
import { ptBR } from "@material-ui/core/locale";

export const theme = createMuiTheme(
  {
    palette: {
      macro: blue[600],
      regional: green[600],
      social: red[600],
    },
    chart: {
      height: 512,
    },
  },
  ptBR
);
