import React from "react";

import { Link, TableContainer, Paper } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import { TableSortable } from "../common/Table/Sortable";
import { TableSkeleton } from "../common/Table/Skeleton";

const COUNTRIES_URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

const columns = [
  {
    key: "PAINOME",
    type: "string",
    label: "País",
    render: (row, column) => (
      <Link component={RouterLink} to={`/series?PAINOME=${row["PAINOME"]}`}>
        {row[column.key]}
      </Link>
    ),
  },
  {
    key: "Metadados@odata.count",
    type: "numeric",
    label: "Qtd. de séries",
  },
];

export function Countries() {
  const { isLoading, data } = useQuery("Countries", async () => {
    return await (await fetch(COUNTRIES_URL)).json();
  });

  const countries = (data && data.value) || [];

  return (
    <TableContainer component={Paper}>
      <TableSortable
        isLoading={isLoading}
        rows={countries}
        rowKey="PAICODIGO"
        columns={columns}
        defaultOrderBy="Metadados@odata.count"
        skeleton={<TableSkeleton nRows={10} nColumns={columns.length} />}
      />
    </TableContainer>
  );
}

export default Countries;
