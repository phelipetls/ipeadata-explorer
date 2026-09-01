import type { RegionalLevel } from '../types'
import { Select } from './Select'
import regionsMetadata from '../assets/regions.json' with { type: 'json' }
import statesMetadata from '../assets/states.json' with { type: 'json' }
import { displayRegionalLevel } from '../utils/display-regional-level'

interface Props {
  regionalDivision: RegionalLevel
  value: number
  onChange: (value: number) => void
}

const locationsToOptions = (obj: { name: string; code: number }) => {
  return {
    label: obj.name,
    value: obj.code,
  }
}

export function RegionSelect({ regionalDivision, value, onChange }: Props) {
  const options = [
    { group: '', value: 0, label: displayRegionalLevel('brazil') },
    ...(regionalDivision === 'states' || regionalDivision === 'municipalities'
      ? regionsMetadata
          .map(locationsToOptions)
          .map((item) => ({ ...item, group: displayRegionalLevel('states') }))
      : []),
    ...(regionalDivision === 'municipalities'
      ? statesMetadata.map(locationsToOptions).map((item) => ({
          ...item,
          group: displayRegionalLevel('municipalities'),
        }))
      : []),
  ]

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options.sort((a, b) => a.label.localeCompare(b.label))}
      isMultiple={false}
    />
  )
}
