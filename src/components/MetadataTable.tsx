import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { SeriesMetadata, TableColumn } from 'types'

function formatDate(date: string | null): string {
  return new Date(date || Date.now()).toLocaleDateString()
}

const metadataFields: TableColumn<SeriesMetadata>[] = [
  {
    accessor: 'FNTNOME',
    label: 'Fonte',
    render: ({ FNTNOME, FNTURL, FNTSIGLA }) => (
      <Link
        component={RouterLink}
        to={`/series?FNTNOME=${FNTNOME || FNTURL || FNTSIGLA}`}
      >
        {FNTNOME || FNTURL || FNTSIGLA}
      </Link>
    ),
  },
  { accessor: 'BASNOME', label: 'Base' },
  { accessor: 'TEMNOME', label: 'Tema' },
  { accessor: 'PERNOME', label: 'Periodicidade' },
  { accessor: 'UNINOME', label: 'Unidade de medida' },
  { accessor: 'SERQNT', label: 'Qtd. de observações' },
  {
    accessor: 'SERMINDATA',
    label: 'Início',
    render: (metadata) => formatDate(metadata.SERMINDATA),
  },
  {
    accessor: 'SERMAXDATA',
    label: 'Fim',
    render: (metadata) => formatDate(metadata.SERMAXDATA),
  },
  {
    accessor: 'SERSTATUS',
    label: 'Status',
    render: (metadata) => (metadata.SERSTATUS === 'A' ? 'Ativa' : 'Inativa'),
  },
]

const useStyles = makeStyles({
  header: {
    fontWeight: 'bold',
  },
})

interface Props {
  metadata: SeriesMetadata
}

export function MetadataTable(props: Props) {
  const classes = useStyles()

  const { metadata } = props

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell className={classes.header} component='th'>
            Metadado
          </TableCell>

          <TableCell className={classes.header} component='th'>
            Valor
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {metadataFields.map(({ label, accessor, render }) => (
          <TableRow key={label}>
            <TableCell component='th' scope='row' key='label'>
              {label}
            </TableCell>
            <TableCell key='valor'>
              {render ? render(metadata) : accessor ? metadata[accessor] : ''}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
