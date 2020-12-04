import { useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";

export function useBreakpoint(breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
}
