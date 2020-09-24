import { useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";

export function useSmallScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}
