import React, { useState } from "react";

import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "react-query";

import { ThemeCard } from "./ThemeCard";
import { ThemeName } from "./ThemeName";
import { ThemeParent } from "./ThemeParent";
import { ThemeBases } from "./ThemeBases";
import { ThemeBasesButtons } from "./ThemeBasesButtons";
import { Loading } from "../common/Loading";

import { BASE_URL } from "../api/odata";
import { BaseType } from "./types"

const useStyles = makeStyles(theme => ({
  grid: {
    margin: "2em auto",
    display: "grid",
    justifyContent: "center",
    gridTemplateColumns: "repeat(auto-fit, 7rem)",
    gridAutoRows: "minmax(5em, auto)",
    gridGap: theme.spacing(2),
  },
}));

const ENDPOINT = BASE_URL + "Temas";

interface ThemeMetadata {
  TEMCODIGO: number,
  TEMCODIGO_PAI?: number,
  TEMNOME: string,
  MACRO?: number,
  REGIONAL?: number,
  SOCIAL?: number,
}

export function Themes() {
  const classes = useStyles();

  const [bases, setBases] = useState<BaseType[]>(["MACRO", "REGIONAL", "SOCIAL"]);

  const handleChangeBases = (_: any, newBases: BaseType[]) => {
    setBases(newBases);
  };

  const { isLoading, data } = useQuery("Themes", async () => {
    return await (await fetch(ENDPOINT)).json();
  });

  const themes: ThemeMetadata[] = (data && data.value) || [];

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <ThemeBasesButtons bases={bases} onChange={handleChangeBases} />

      <Container maxWidth="sm" className={classes.grid}>
        {themes
          .filter(theme => bases.some(base => theme[base] !== null))
          .map(theme => {
            const {
              TEMNOME,
              TEMCODIGO,
              TEMCODIGO_PAI,
              MACRO,
              REGIONAL,
              SOCIAL,
            } = theme;

            const parentTheme = themes.find(
              theme => theme.TEMCODIGO === TEMCODIGO_PAI
            );

            return (
              <ThemeCard themeName={TEMNOME} key={TEMCODIGO}>
                <ThemeName name={TEMNOME} />

                {parentTheme ? <ThemeParent name={parentTheme.TEMNOME} /> : null}

                {(MACRO || REGIONAL || SOCIAL) ? (
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
