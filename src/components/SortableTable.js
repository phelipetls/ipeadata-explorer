import React, { useState } from "react";

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
    marginBottom: "2em"
  }
}));

const invertSortDirections = {
  asc: "desc",
  desc: "asc"
};

const sortFunctions = {
  string: (a, b) => a.localeCompare(b),
  numeric: (a, b) => a - b
};

export default function SortableTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState(props.defaultOrderBy);

  const { columns, data, rowKey } = props;

  const handleSort = (e, column) => {
    if (column === orderBy) {
      setOrder(invertSortDirections[order]);
    } else {
      setOrder("desc");
      setOrderBy(column);
    }
  };

  const columnType = columns.find(column => column.key === orderBy).type;

  const sortOrder = order === "asc" ? 1 : -1;
  const sortFunction = sortFunctions[columnType];
  const sorter = (a, b) => {
    return sortOrder * sortFunction(a, b);
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell
                key={column.key}
                value={column.key}
                align={column.type === "numeric" ? "right" : "left"}
                sortDirection={orderBy === column.key ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.key}
                  direction={orderBy === column.key ? order : "asc"}
                  onClick={e => handleSort(e, column.key)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .sort((a, b) => sorter(a[orderBy], b[orderBy]))
            .map(row => (
              <TableRow key={row[rowKey]}>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.type === "numeric" ? "right" : "left"}
                  >
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
