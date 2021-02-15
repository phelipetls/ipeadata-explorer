import * as React from "react";

import { Link, TableContainer, Paper } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import axios from "redaxios";
import { useQuery } from "react-query";

import { TableSortable, TableSkeleton } from "components";
import { TableColumn } from "types";

const COUNTRIES_URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?" +
  "$expand=Metadados($select=SERCODIGO;$count=true)";

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
      <Link component={RouterLink} to={`/series?PAICODIGO=${row["PAINOME"]}`}>
        {row["PAINOME"]}
      </Link>
    ),
  },
  {
    key: "Metadados@odata.count",
    label: "Qtd. de séries",
    type: "numeric",
  },
];

export function Countries() {
  const { isLoading, data } = useQuery("Countries", async () => {
    const response = await axios.get(COUNTRIES_URL);
    return response.data;
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
