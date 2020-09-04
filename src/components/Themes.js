import React, { useState, useEffect } from "react";

import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ThemeCard from "./ThemeCard";
import ThemeName from "./ThemeName";
import ThemeParent from "./ThemeParent";
import ThemeBases from "./ThemeBases";

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
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    async function getThemes() {
      const response = await fetch(URL);
      const json = await response.json();
      setThemes(json.value);
    }

    getThemes();
  }, []);

  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.grid}>
      {themes.map(theme => {
        const {
          TEMCODIGO,
          TEMNOME,
          TEMCODIGO_PAI,
          MACRO,
          REGIONAL,
          SOCIAL
        } = theme;

        const parent_theme = themes.find(
          theme => theme.TEMCODIGO === TEMCODIGO_PAI
        );

        return (
          <ThemeCard code={TEMCODIGO}>
            <ThemeName name={TEMNOME} />
            {parent_theme && <ThemeParent name={parent_theme.TEMNOME} />}
            <ThemeBases macro={MACRO} regional={REGIONAL} social={SOCIAL} />
          </ThemeCard>
        );
      })}
    </Container>
  );
}
