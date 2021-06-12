import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { BASE_URL } from "api/ipea";
import { Loading } from "components";
import * as React from "react";
import { useQuery } from "react-query";
import axios from "redaxios";
import { ThemeBases, ThemeCard, ThemeName, ThemeParent } from "./components";
import { BaseType } from "./types";

const useStyles = makeStyles((theme) => ({
  grid: {
    margin: "2em auto",
    display: "grid",
    justifyContent: "center",
    gridTemplateColumns: "repeat(auto-fit, 7rem)",
    gridAutoRows: "minmax(5em, auto)",
    gridGap: theme.spacing(2),
  },
  buttonsGroup: {
    display: "flex",
    margin: "2em 0",
    justifyContent: "center",
  },
  macro: {
    color: theme.palette.macro,
  },
  regional: {
    color: theme.palette.regional,
  },
  social: {
    color: theme.palette.social,
  },
}));

const THEME_URL = BASE_URL + "Temas";

interface ThemeMetadata {
  TEMCODIGO: number;
  TEMCODIGO_PAI: number | null;
  TEMNOME: string;
  MACRO: number | null;
  REGIONAL: number | null;
  SOCIAL: number | null;
}

export function Themes() {
  const classes = useStyles();

  const [bases, setBases] = React.useState<BaseType[]>([
    "MACRO",
    "REGIONAL",
    "SOCIAL",
  ]);

  const handleChangeBases = (_: any, newBases: BaseType[]) => {
    setBases(newBases);
  };

  const { isLoading, data } = useQuery("Themes", async () => {
    const response = await axios.get(THEME_URL);
    return response.data;
  });

  const themes: ThemeMetadata[] = data?.value || [];

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <ToggleButtonGroup
        value={bases}
        onChange={handleChangeBases}
        size="large"
        className={classes.buttonsGroup}
      >
        <ToggleButton value="MACRO" classes={{ label: classes.macro }}>
          Macroeconômico
        </ToggleButton>
        <ToggleButton value="REGIONAL" classes={{ label: classes.regional }}>
          Regional
        </ToggleButton>
        <ToggleButton value="SOCIAL" classes={{ label: classes.social }}>
          Social
        </ToggleButton>
      </ToggleButtonGroup>

      <Container maxWidth="sm" className={classes.grid}>
        {themes
          .filter((theme) => bases.some((base) => theme[base] !== null))
          .map((theme) => {
            const {
              TEMNOME,
              TEMCODIGO,
              TEMCODIGO_PAI,
              MACRO,
              REGIONAL,
              SOCIAL,
            } = theme;

            const parentTheme = themes.find(
              (theme) => theme.TEMCODIGO === TEMCODIGO_PAI
            );

            return (
              <ThemeCard themeName={TEMNOME} key={TEMCODIGO}>
                <ThemeName name={TEMNOME} />

                {parentTheme ? (
                  <ThemeParent name={parentTheme.TEMNOME} />
                ) : null}

                {MACRO || REGIONAL || SOCIAL ? (
                  <ThemeBases
                    macro={MACRO}
                    regional={REGIONAL}
                    social={SOCIAL}
                  />
                ) : null}
              </ThemeCard>
            );
          })}
      </Container>
    </div>
  );
}

export default Themes;
