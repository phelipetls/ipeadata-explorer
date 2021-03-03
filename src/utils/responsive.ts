import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

export function useBreakpoint(breakpoint: Breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
}
