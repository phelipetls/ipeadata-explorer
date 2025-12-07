import regionsMetadata from '../assets/regions.json' with { type: 'json' }
import statesMetadata from '../assets/states.json' with { type: 'json' }
import municipalitiesMetadata from '../assets/municipalities.json' with { type: 'json' }
import { BRAZIL_LOCATION_CODE } from '../consts'

const locationHierarchyMap = new Map<number, Set<number>>()

const addHierarchy = (parentCode: number, childCode: number): void => {
  if (!locationHierarchyMap.has(parentCode)) {
    locationHierarchyMap.set(parentCode, new Set<number>())
  }
  locationHierarchyMap.get(parentCode)!.add(childCode)
}

for (const region of regionsMetadata) {
  addHierarchy(BRAZIL_LOCATION_CODE, region.code)
}

for (const state of statesMetadata) {
  addHierarchy(BRAZIL_LOCATION_CODE, state.code)
  addHierarchy(state.region.code, state.code)
}

for (const municipality of municipalitiesMetadata) {
  addHierarchy(BRAZIL_LOCATION_CODE, municipality.code)
  addHierarchy(municipality.region.code, municipality.code)
  addHierarchy(municipality.state.code, municipality.code)
}

export function getContainingLocations(locationCode: number): Set<number> {
  return locationHierarchyMap.get(locationCode) ?? new Set()
}
