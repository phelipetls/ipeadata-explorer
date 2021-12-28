import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { TableSortable } from '../TableSortable'
import userEvent from '@testing-library/user-event'

describe('sort rows based on column and toggle direction if already clicked', () => {
  it('should work with strings', () => {
    render(
      <TableSortable
        rows={[
          {
            letter: 'A',
          },
          {
            letter: 'Z',
          },
        ]}
        rowKey='letter'
        columns={[{ accessor: 'letter', label: 'Letter', type: 'string' }]}
      />
    )

    const table = screen.getByRole('table') as HTMLTableElement

    expect(table.rows[1].cells[0]).toHaveTextContent('A')
    expect(table.rows[2].cells[0]).toHaveTextContent('Z')

    userEvent.click(screen.getByText('Letter'))

    expect(table.rows[1].cells[0]).toHaveTextContent('Z')
    expect(table.rows[2].cells[0]).toHaveTextContent('A')

    userEvent.click(screen.getByText('Letter'))

    expect(table.rows[1].cells[0]).toHaveTextContent('A')
    expect(table.rows[2].cells[0]).toHaveTextContent('Z')
  })

  it('should work with numbers', () => {
    render(
      <TableSortable
        rows={[
          {
            number: 1,
          },
          {
            number: 2,
          },
        ]}
        rowKey='number'
        columns={[{ accessor: 'number', label: 'Number', type: 'number' }]}
      />
    )

    const table = screen.getByRole('table') as HTMLTableElement

    expect(table.rows[1].cells[0]).toHaveTextContent('1')
    expect(table.rows[2].cells[0]).toHaveTextContent('2')

    userEvent.click(screen.getByText('Number'))

    expect(table.rows[1].cells[0]).toHaveTextContent('2')
    expect(table.rows[2].cells[0]).toHaveTextContent('1')

    userEvent.click(screen.getByText('Number'))

    expect(table.rows[1].cells[0]).toHaveTextContent('1')
    expect(table.rows[2].cells[0]).toHaveTextContent('2')
  })

  it('should work with dates', () => {
    render(
      <TableSortable
        rows={[
          {
            date: '1970-01-01T00:00:00',
          },
          {
            date: '2021-03-11T00:00:00',
          },
        ]}
        rowKey='date'
        columns={[{ accessor: 'date', label: 'Date', type: 'date' }]}
      />
    )

    const table = screen.getByRole('table') as HTMLTableElement

    expect(table.rows[1].cells[0]).toHaveTextContent('1970-01-01T00:00:00')
    expect(table.rows[2].cells[0]).toHaveTextContent('2021-03-11T00:00:00')

    userEvent.click(screen.getByText('Date'))

    expect(table.rows[1].cells[0]).toHaveTextContent('2021-03-11T00:00:00')
    expect(table.rows[2].cells[0]).toHaveTextContent('1970-01-01T00:00:00')

    userEvent.click(screen.getByText('Date'))

    expect(table.rows[1].cells[0]).toHaveTextContent('1970-01-01T00:00:00')
    expect(table.rows[2].cells[0]).toHaveTextContent('2021-03-11T00:00:00')
  })
})
