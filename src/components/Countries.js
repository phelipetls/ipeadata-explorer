import React, { useState, useEffect } from "react";

import { Link, TableRow, TableCell } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import SortableTable from "./SortableTable";
import TableSkeleton from "./TableSkeleton";

const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

const columns = [
  {
    key: "PAINOME",
    type: "string",
    label: "País",
    render: (row, column) => (
      <Link component={RouterLink} to={`/series?PAICODIGO=${row["PAICODIGO"]}`}>
        {row[column.key]}
      </Link>
    )
  },
  {
    key: "Metadados@odata.count",
    type: "numeric",
    label: "Qtd. de séries"
  }
];

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch(URL)
      .then(response => response.json())
      .then(json => setCountries(json.value))
      .then(() => setIsLoading(false));
  }, []);

  const body = isLoading ? (
    <TableSkeleton rows={10} columns={columns.length} />
  ) : (
    countries.map(row => (
      <TableRow key={row["PAICODIGO"]}>
        {columns.map((column, index) => (
          <TableCell
            key={column.key}
            align={column.type === "numeric" ? "right" : "left"}
          >
            {column.render ? column.render(row, column) : row[column.key]}
          </TableCell>
        ))}
      </TableRow>
    ))
  );

  return (
    <SortableTable
      rows={countries}
      columns={columns}
      body={body}
      defaultOrderBy="Metadados@odata.count"
    />
  );
}
