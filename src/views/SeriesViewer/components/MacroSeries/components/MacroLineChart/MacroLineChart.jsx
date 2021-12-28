import * as React from 'react'
import { LineChart } from 'components'

export function MacroLineChart({ metadata, series, ...rest }) {
  const labels = series.map((series) => series.VALDATA)

  const datasets = [
    {
      label: metadata.SERCODIGO,
      data: series.map((series) => series.VALVALOR),
    },
  ]

  return (
    <LineChart
      metadata={metadata}
      labels={labels}
      datasets={datasets}
      {...rest}
    />
  )
}
