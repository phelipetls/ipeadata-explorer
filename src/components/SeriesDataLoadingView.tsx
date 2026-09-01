import { LoadingIndicator } from './LoadingIndicator'
import { SeriesDataFilterGroup } from './SeriesDataFilterGroup'
import { SeriesDataFilterItem } from './SeriesDataFilterItem'
import { SeriesDataFilterItemLabel } from './SeriesDataFilterItemLabel'
import { Skeleton } from './Skeleton'

export function SeriesDataLoadingView() {
  return (
    <>
      <SeriesDataFilterGroup className='h-[56px]'>
        {Array.from({ length: 3 })
          .fill(null)
          .map((_, index) => (
            <SeriesDataFilterItem key={index}>
              <SeriesDataFilterItemLabel>
                <Skeleton className='w-[10ch]' />
              </SeriesDataFilterItemLabel>

              <Skeleton className='flex-1 w-[160px]' />
            </SeriesDataFilterItem>
          ))}
      </SeriesDataFilterGroup>

      <div className='flex-1 flex items-center justify-center h-[600px]'>
        <LoadingIndicator />
      </div>
    </>
  )
}
