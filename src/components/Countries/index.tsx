import React from "react";

import { Link, TableContainer, Paper, TableRow, TableCell } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import { TableSortable } from "components/common/Table/TableSortable";
import { TableConfig } from "components/common/Table/TableSortable/types";
import { TableSkeleton } from "components/common/Table/TableSkeleton";

const COUNTRIES_URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

interface Country {
  [index: string]: string | number;
  PAINOME: string;
  "Metadados@odata.count": number;
}

const columns: TableConfig[] = [
  {
    key: "PAINOME",
    label: "País",
    dataType: "text",
    render: (row: Country) => (
      <Link component={RouterLink} to={`/series?PAINOME=${row["PAINOME"]}`}>
        {row["PAINOME"]}
      </Link>
    ),
  },
  {
    key: "Metadados@odata.count",
    label: "Qtd. de séries",
    dataType: "numeric",
  },
];

export function Countries() {
  const { isLoading, data } = useQuery("Countries", async () => {
    return await (await fetch(COUNTRIES_URL)).json();
  });

  const countries: Country[] = (data && data.value) || [];

  return (
    <TableContainer component={Paper}>
      <TableSortable
        rows={countries}
        columns={columns}
        isLoading={isLoading}
        skeleton={<TableSkeleton nRows={10} nColumns={columns.length} />}
      >
        {row => <TableRow key={row["PAINOME"]}>
          {columns.map(column => (
            <TableCell key={column.key} align="left">
              {column.render ? column.render(row) : row[column.key]}
            </TableCell>
          ))}
        </TableRow>
        }
      </TableSortable>
    </TableContainer>
  );
}

export default Countries;
