import { schemeCategory10 as palette } from 'd3-scale-chromatic'

export const coloredDatasetsPlugin = {
  id: 'colors',
  beforeUpdate: (chart) => {
    chart.data.datasets = chart.data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: palette[index % palette.length],
      borderColor: palette[index % palette.length],
    }))
  },
}
