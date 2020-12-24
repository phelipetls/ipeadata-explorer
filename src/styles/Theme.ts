import { createMuiTheme } from "@material-ui/core/styles";
import { blue, green, red } from "@material-ui/core/colors";
import { ptBR } from "@material-ui/core/locale";

declare module '@material-ui/core/styles/createMuiTheme' {
  interface ThemeOptions {
    chart?: {
      height?: number
    }
  }
  interface Theme {
    chart: {
      height: number
    }
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    macro?: string,
    regional?: string,
    social?: string,
  }
  interface Palette {
    macro: string,
    regional: string,
    social: string,
  }
}

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
