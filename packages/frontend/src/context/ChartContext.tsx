import { createContext, useContext } from 'react'

type ChartContextValue = {
  backgroundColor: string
  width: number
  height: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
}

const DEFAULT_CHART_DIMENSIONS = {
  backgroundColor: '#ffffff',
  width: 600,
  height: 400,
  marginTop: 30,
  marginRight: 30,
  marginBottom: 30,
  marginLeft: 40,
}

const value: ChartContextValue = DEFAULT_CHART_DIMENSIONS

export const ChartContext = createContext<ChartContextValue>(value)

export const useChartContext = () => useContext(ChartContext)
