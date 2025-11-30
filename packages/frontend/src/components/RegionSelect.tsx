import type { RegionalLevel } from '../types'
import { Select } from './Select'
import { useQuery } from '@tanstack/react-query'
import { getBrazilMap } from '../api/ibge/get-brazil-map'

interface RegionSelectOption {
  group: string
  value: string
  label: string
}

interface Props {
  regionalDivision: RegionalLevel
  value: string
  onChange: (value: string) => void
}

export function RegionSelect({ regionalDivision, value, onChange }: Props) {
  const { data: geojson } = useQuery({
    queryKey: ['brazilMap', regionalDivision],
    queryFn: ({ signal }) =>
      getBrazilMap({
        intraRegion: regionalDivision as 'municipalities' | 'states',
        signal,
      }),
    enabled:
      regionalDivision === 'municipalities' || regionalDivision === 'states',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  if (!geojson) {
    return null
  }

  const seenStates = new Set<string>()
  const seenRegions = new Set<string>()
  const regions: RegionSelectOption[] = []
  const states: RegionSelectOption[] = []

  for (const feature of geojson.features) {
    const regionCode = feature.properties.regionCode
    const regionName = feature.properties.regionName
    if (
      regionCode !== null &&
      regionName !== null &&
      !seenRegions.has(String(regionCode))
    ) {
      seenRegions.add(String(regionCode))
      regions.push({
        group: 'Regiões',
        value: String(regionCode),
        label: regionName,
      })
    }

    const stateCode = feature.properties.stateCode
    const stateName = feature.properties.stateName
    if (
      stateCode !== null &&
      stateName !== null &&
      !seenStates.has(String(stateCode))
    ) {
      seenStates.add(String(stateCode))
      states.push({
        group: 'Estados',
        value: String(stateCode),
        label: stateName,
      })
    }
  }

  const options = [
    { group: '', value: 'brazil', label: 'Brasil' },
    ...regions.sort((a, b) => a.label.localeCompare(b.label)),
    ...states.sort((a, b) => a.label.localeCompare(b.label)),
  ]

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      isMultiple={false}
    />
  )
}
