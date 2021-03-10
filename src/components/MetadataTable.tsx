import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { SeriesMetadata, TableColumn } from "types";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

const metadataFields: TableColumn<SeriesMetadata>[] = [
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

const useStyles = makeStyles({
  header: {
    fontWeight: "bold",
  },
});

interface Props {
  metadata: Partial<SeriesMetadata>;
}

export function MetadataTable(props: Props) {
  const classes = useStyles();

  const { metadata } = props;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell className={classes.header} component="th">
            Metadado
          </TableCell>

          <TableCell className={classes.header} component="th">
            Valor
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {metadataFields.map(({ label, key, render }) => (
          <TableRow key={label}>
            <TableCell component="th" scope="row" key="label">
              {label}
            </TableCell>
            <TableCell key="valor">
              {render ? render(metadata) : key ? metadata[key] : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
