import React, { useState, useEffect } from "react";

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel
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
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

const invertSortDirections = {
  asc: "desc",
  desc: "asc"
};

const sortFunctions = {
  string: (a, b) => a.localeCompare(b),
  numeric: (a, b) => a - b,
}

const headers = {
  PAINOME: { type: "string", label: "País" },
  "Metadados@odata.count": { type: "numeric", label: "Qtd. de séries" }
};

export default function Countries() {
  const classes = useStyles();
  const [countries, setCountries] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("Metadados@odata.count");

  useEffect(() => {
    async function fetchCountries() {
      const response = await fetch(URL);
      const json = await response.json();
      setCountries(json.value);
    }

    fetchCountries();
  }, []);

  const handleSort = (e, header) => {
    if (header === orderBy) {
      setOrder(invertSortDirections[order]);
    } else {
      setOrder("desc");
      setOrderBy(header);
    }
  };

  const headerType = headers[orderBy].type;

  const sortOrder = order === "asc" ? 1 : -1;
  const sortFunction = sortFunctions[headerType];
  const sorter = (a, b) => {
    return sortOrder * sortFunction(a, b);
  }

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {Object.entries(headers).map(([header, props]) => {
              return (
                <TableCell
                  key={header}
                  value={header}
                  align={props.type === "numeric" ? "right" : "left"}
                  sortDirection={orderBy === header ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === header}
                    direction={orderBy === header ? order : "asc"}
                    onClick={e => handleSort(e, header)}
                  >
                    {props.label}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {countries
              .sort((a, b) => sorter(a[orderBy], b[orderBy]))
              .map(country => {
            return (
              <TableRow key={country["PAICODIGO"]}>
                <TableCell component="th" scope="row">
                  {country["PAINOME"]}
                </TableCell>
                <TableCell align="right">
                  {country["Metadados@odata.count"]}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
