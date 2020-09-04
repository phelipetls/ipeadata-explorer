import React, { useState, useEffect } from "react";

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxWidth: theme.breakpoints.values.sm,
    margin: "0 auto",
    marginBottom: "2em",
  },
}));

const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO)";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchCountries() {
      const response = await fetch(URL);
      const json = await response.json();
      setCountries(json.value);
    }

    fetchCountries();
  }, [])

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell sortDirection="desc">País</TableCell>
            <TableCell align="right">Qtd. de séries</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map(country => {
            return (
              <TableRow key={country.PAICODIGO}>
                <TableCell component="th" scope="row">{country.PAINOME}</TableCell>
                <TableCell align="right">{country.Metadados.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
