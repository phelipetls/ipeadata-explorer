import * as React from "react";

import {
  Link,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { TableColumn, SeriesMetadata } from "types";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

const metadataFields: TableColumn[] = [
  {
    key: "FNTNOME",
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
  { key: "BASNOME", label: "Base" },
  { key: "TEMNOME", label: "Tema" },
  { key: "PERNOME", label: "Periodicidade" },
  { key: "UNINOME", label: "Unidade de medida" },
  { key: "SERQNT", label: "Qtd. de observações" },
  {
    key: "SERMINDATA",
    label: "Início",
    render: metadata => formatDate(metadata.SERMINDATA),
  },
  {
    key: "SERMAXDATA",
    label: "Fim",
    render: metadata => formatDate(metadata.SERMAXDATA),
  },
  {
    key: "SERSTATUS",
    label: "Status",
    render: metadata => (metadata.SERSTATUS === "A" ? "Ativa" : "Inativa"),
  },
];

const BoldTableCell = withStyles(() => ({
  head: {
    fontWeight: "bold",
  },
}))(TableCell);

interface Props<T> {
  metadata: T;
}

export function MetadataTable<T extends Partial<SeriesMetadata>>(
  props: Props<T>
) {
  const { metadata } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <BoldTableCell component="th">Metadado</BoldTableCell>
          <BoldTableCell component="th">Valor</BoldTableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {metadataFields.map(({ label, key, render }) => (
          <TableRow key={label}>
            <BoldTableCell component="th" scope="row" key="label">
              {label}
            </BoldTableCell>
            <BoldTableCell key="valor">
              {render ? render(metadata) : key ? metadata[key] : ""}
            </BoldTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
