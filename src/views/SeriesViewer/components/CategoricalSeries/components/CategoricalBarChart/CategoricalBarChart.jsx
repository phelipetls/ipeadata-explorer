import { BarChart } from 'components'
import * as React from 'react'

export function CategoricalBarChart({ categories, metadata, ...rest }) {
  const labels = categories.map((category) => category.VALVALOR)

  const datasets = [
    {
      label: metadata.UNINOME,
      data: categories.map((category) => category.count),
    },
  ]

  return (
    <BarChart
      labels={labels}
      datasets={datasets}
      metadata={metadata}
      {...rest}
    />
  )
}
