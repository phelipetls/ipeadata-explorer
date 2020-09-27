import React, { useState, useEffect } from "react";

import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import TableSortable from "./TableSortable";
import TableSkeleton from "./TableSkeleton";
import TableWrapper from "./TableWrapper";

const URL =
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

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      setIsLoading(true);

      const response = await fetch(URL);
      const json = await response.json();
      setCountries(json.value);

      setIsLoading(false);
    }

    fetchCountries();
  }, []);

  return (
    <TableWrapper>
      <TableSortable
        rows={countries}
        rowKey="PAICODIGO"
        columns={columns}
        defaultOrderBy="Metadados@odata.count"
        isLoading={isLoading}
        fallback={<TableSkeleton nRows={10} nColumns={columns.length} />}
      />
    </TableWrapper>
  );
}
