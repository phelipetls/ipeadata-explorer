import React from "react";

import { Link, TableContainer, Paper } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";

import { TableSortable, TableSkeleton  } from "components/common";
import { TableColumn } from "components/types";

const COUNTRIES_URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

interface CountryMetadata {
  [index: string]: string | number;
  PAINOME: string;
  "Metadados@odata.count": number;
}

const columns: TableColumn<CountryMetadata>[] = [
  {
    key: "PAINOME",
    label: "País",
    type: "string",
    render: (row: CountryMetadata) => (
      <Link component={RouterLink} to={`/series?PAINOME=${row["PAINOME"]}`}>
        {row["PAINOME"]}
      </Link>
    ),
  },
  {
    key: "Metadados@odata.count",
    label: "Qtd. de séries",
    type: "string",
  },
];

export function Countries() {
  const { isLoading, data } = useQuery("Countries", async () => {
    return await (await fetch(COUNTRIES_URL)).json();
  });

  const countries: CountryMetadata[] = (data && data.value) || [];

  return (
    <TableContainer component={Paper}>
      <TableSortable
        rows={countries}
        rowKey="PAINOME"
        columns={columns}
        isLoading={isLoading}
        skeleton={<TableSkeleton nRows={10} nColumns={columns.length} />}
      />
    </TableContainer>
  );
}

export default Countries;
