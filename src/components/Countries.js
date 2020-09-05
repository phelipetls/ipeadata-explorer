import React, { useState, useEffect } from "react";

import {} from "@material-ui/core";

import SortableTable from "./SortableTable";

const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Paises?$expand=Metadados($select=SERCODIGO;$count=true)";

// const json = [
//   {
//     PAICODIGO: "AFG",
//     PAINOME: "Afeganistão",
//     "Metadados@odata.count": 1,
//     Metadados: [
//       {
//         SERCODIGO: "CHTOTMUN"
//       }
//     ]
//   },
//   {
//     PAICODIGO: "ZAF",
//     PAINOME: "África do Sul",
//     "Metadados@odata.count": 5,
//     Metadados: [
//       {
//         SERCODIGO: "WDI_PIBPPCZAF"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCRZAF"
//       },
//       {
//         SERCODIGO: "KOF_KOFZAF"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCCAPRZAF"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCCAPZAF"
//       }
//     ]
//   },
//   {
//     PAICODIGO: "DEU",
//     PAINOME: "Alemanha",
//     "Metadados@odata.count": 31,
//     Metadados: [
//       {
//         SERCODIGO: "ECONMI12_ALCCY12"
//       },
//       {
//         SERCODIGO: "IFS12_IPCALE12"
//       },
//       {
//         SERCODIGO: "ECONMI12_ALU12"
//       },
//       {
//         SERCODIGO: "IFS_IPAUALE"
//       },
//       {
//         SERCODIGO: "IFS4_TJCALLALE4"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCCAPDEU"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCCAPRDEU"
//       },
//       {
//         SERCODIGO: "IFS_GDPALEN"
//       },
//       {
//         SERCODIGO: "IFS12_CAMBALE12"
//       },
//       {
//         SERCODIGO: "ECONMI12_ALBCY12"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCDEU"
//       },
//       {
//         SERCODIGO: "IFS12_TJCALLALE12"
//       },
//       {
//         SERCODIGO: "ECONMI12_ALPIG12"
//       },
//       {
//         SERCODIGO: "IFS4_IPCALE4"
//       },
//       {
//         SERCODIGO: "ECONMI4_ALPIBG34"
//       },
//       {
//         SERCODIGO: "IFS4_GDPALE4"
//       },
//       {
//         SERCODIGO: "IFS_TJCALLALE"
//       },
//       {
//         SERCODIGO: "IFS12_IPAUALE12"
//       },
//       {
//         SERCODIGO: "WDI_PIBPPCRDEU"
//       },
//       {
//         SERCODIGO: "IFS_IPCALE"
//       },
//       {
//         SERCODIGO: "IFS_GDPALE"
//       },
//       {
//         SERCODIGO: "ECONMI12_ALPPG12"
//       },
//       {
//         SERCODIGO: "ECONMI4_ALPIBG4"
//       },
//       {
//         SERCODIGO: "ECONMI12_ALWG12"
//       },
//       {
//         SERCODIGO: "ECONMI12_ALPCG12"
//       },
//       {
//         SERCODIGO: "IFS4_IPAUALE4"
//       },
//       {
//         SERCODIGO: "KOF_KOFDEU"
//       },
//       {
//         SERCODIGO: "OCDE_PRODALE"
//       },
//       {
//         SERCODIGO: "IFS4_CAMBALE4"
//       },
//       {
//         SERCODIGO: "IFS_CAMBALE"
//       },
//       {
//         SERCODIGO: "IFS4_GDPALEN4"
//       }
//     ]
//   }
// ]

const columns = {
  PAINOME: { type: "string", label: "País" },
  "Metadados@odata.count": { type: "numeric", label: "Qtd. de séries" }
};

export default function Countries() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function fetchCountries() {
      const response = await fetch(URL);
      const json = await response.json();
      setCountries(json.value);
    }

    fetchCountries();
  }, []);

  return (
    <SortableTable
      columns={columns}
      data={countries}
      rowKey="PAICODIGO"
      defaultOrderBy="Metadados@odata.count"
    />
  );
}
