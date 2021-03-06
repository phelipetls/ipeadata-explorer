import { Link, Paper, TableContainer } from "@material-ui/core";
import { TableSkeleton, TableSortable } from "components";
import * as React from "react";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import axios from "redaxios";
import { TableColumn } from "types";

const COUNTRIES_URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?" +
  "$expand=Metadados($select=SERCODIGO;$count=true)";

interface CountryMetadata {
  PAINOME: string;
  "Metadados@odata.count": number;
}

const columns: TableColumn<CountryMetadata>[] = [
  {
    accessor: "PAINOME",
    label: "País",
    type: "string",
    render: (row: CountryMetadata) => (
      <Link component={RouterLink} to={`/series?PAICODIGO=${row["PAINOME"]}`}>
        {row["PAINOME"]}
      </Link>
    ),
  },
  {
    accessor: "Metadados@odata.count",
    label: "Qtd. de séries",
    type: "number",
  },
];

export function Countries() {
  const { isLoading, data } = useQuery("Countries", async () => {
    const response = await axios.get(COUNTRIES_URL);
    return response.data;
  });

  const countries: CountryMetadata[] = data?.value || [];

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
