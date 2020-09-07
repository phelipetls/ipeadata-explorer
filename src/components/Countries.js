import React, { useState, useEffect } from "react";

import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import SortableTable from "./SortableTable";
import Loading from "./Loading";

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
    async function fetchCountries() {
      setIsLoading(true);

      const response = await fetch(URL);
      const json = await response.json();
      setCountries(json.value);

      setIsLoading(false);
    }

    fetchCountries();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <SortableTable
      rows={countries}
      columns={columns}
      rowKey="PAICODIGO"
      defaultOrderBy="Metadados@odata.count"
    />
  );
}
