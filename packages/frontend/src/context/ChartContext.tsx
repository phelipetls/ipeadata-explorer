import { createContext, useContext } from 'react'

type Dimensions = {
  width: number
  height: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
}

const DEFAULT_CHART_DIMENSIONS = {
  width: 600,
  height: 400,
  marginTop: 30,
  marginRight: 30,
  marginBottom: 30,
  marginLeft: 40,
}

const dimensions: Dimensions = DEFAULT_CHART_DIMENSIONS

export const ChartContext = createContext<Dimensions>(dimensions)

export const useChartContext = () => useContext(ChartContext)
