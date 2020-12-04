import React from "react";

import {
  Link,
  Table,
  TableRow,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import { StyledTableCell } from "../../common/Table/StyledTableCell";

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const metadataFields = [
  {
    label: "Fonte",
    render: ({ FNTNOME, FNTURL, FNTSIGLA }) => (
      <Link
        component={RouterLink}
        to={`/series?FNTNOME=${FNTNOME || FNTURL || FNTSIGLA}`}
      >
        {FNTNOME || FNTURL || FNTSIGLA}
      </Link>
    ),
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
    render: metadata => (metadata.SERSTATUS === "A" ? "Ativa" : "Inativa"),
  },
];

export function MetadataTable(props) {
  const { metadata } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <StyledTableCell component="th">Metadado</StyledTableCell>
          <StyledTableCell component="th">Valor</StyledTableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {metadataFields.map(({ label, key, render }) => (
          <TableRow key={label}>
            <StyledTableCell component="th" scope="row" key="label">
              {label}
            </StyledTableCell>
            <StyledTableCell key="valor">
              {key ? metadata[key] : render(metadata)}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
