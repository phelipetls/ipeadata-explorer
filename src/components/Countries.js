import React, { useState, useEffect } from "react";

import SortableTable from "./SortableTable";
import Loading from "./Loading";

const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

const columns = [
  { key: "PAINOME", type: "string", label: "País" },
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
      columns={columns}
      data={countries}
      rowKey="PAICODIGO"
      defaultOrderBy="Metadados@odata.count"
    />
  );
}
