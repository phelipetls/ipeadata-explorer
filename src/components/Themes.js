import React, { useState, useEffect } from "react";

import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ThemeCard from "./ThemeCard";
import ThemeName from "./ThemeName";
import ThemeParent from "./ThemeParent";
import ThemeBases from "./ThemeBases";
import ThemeBasesButtons from "./ThemeBasesButtons";
import Loading from "./Loading";

const useStyles = makeStyles(theme => ({
  grid: {
    margin: "2em auto",
    display: "grid",
    justifyContent: "center",
    gridTemplateColumns: "repeat(auto-fit, 7rem)",
    gridAutoRows: "minmax(5em, auto)",
    gridGap: theme.spacing(2)
  }
}));

const URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/Temas";

export default function Themes() {
  const classes = useStyles();

  const [themes, setThemes] = useState([]);
  const [bases, setBases] = useState(["MACRO", "REGIONAL", "SOCIAL"]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchThemes() {
      setIsLoading(true);

      const response = await fetch(URL);
      const json = await response.json();
      setThemes(json.value);

      setIsLoading(false);
    }

    fetchThemes();
  }, []);

  const handleChangeBases = (e, newBases) => {
    setBases(newBases);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      <ThemeBasesButtons value={bases} onChange={handleChangeBases} />
      <Container maxWidth="sm" className={classes.grid}>
        {themes
          .filter(theme => bases.some(base => theme[base]))
          .map(theme => {
            const { TEMNOME, TEMCODIGO, TEMCODIGO_PAI, MACRO, REGIONAL, SOCIAL } = theme;

            const parent_theme = themes.find(
              theme => theme.TEMCODIGO === TEMCODIGO_PAI
            );

            return (
              <ThemeCard themeName={TEMNOME} key={TEMCODIGO}>
                <ThemeName name={TEMNOME} />
                {parent_theme && <ThemeParent name={parent_theme.TEMNOME} />}
                {(MACRO || REGIONAL || SOCIAL) && (
                  <ThemeBases
                    macro={MACRO}
                    regional={REGIONAL}
                    social={SOCIAL}
                  />
                )}
              </ThemeCard>
            );
          })}
      </Container>
    </div>
  );
}
