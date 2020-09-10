import React from "react";

import {
  Link,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead
} from "@material-ui/core";

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const metadataFields = [
  {
    label: "Fonte",
    render: metadata => (
      <Link href={metadata.FNTURL}>{metadata.FNTNOME}</Link>
    )
  },
  { label: "Base", key: "BASNOME" },
  { label: "Tema", key: "TEMNOME" },
  { label: "Periodicidade", key: "PERNOME" },
  { label: "Unidade de medida", key: "UNINOME" },
  { label: "Qtd. de observações", key: "SERQNT" },
  { label: "Início", render: metadata => formatDate(metadata.SERMINDATA) },
  { label: "Fim", render: metadata => formatDate(metadata.SERMAXDATA) },
  {
    label: "Status",
    render: metadata => (metadata.SERSTATUS === "A" ? "Ativa" : "Inativa")
  }
];

export default function SeriesMetadataTable(props) {
  const { metadata } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell component="th">Metadado</TableCell>
          <TableCell component="th">Valor</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {metadataFields.map(({ label, key, render }) => (
          <TableRow key={label}>
            <TableCell component="th" scope="row" key="label">
              {label}
            </TableCell>
            <TableCell key="valor">
              {key ? metadata[key] : render(metadata)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
