import { useQuery } from '@tanstack/react-query'
import { getSeriesMetadata } from '../api/ipea/get-series-metadata'
import { Tag } from '../components/Tag'
import { useParams } from 'react-router'
import * as z from 'zod'
import type { SeriesPeriodicity } from '../types'
import { SeriesDataTabs } from '../components/SeriesDataTabs'
import { SeriesChartView } from '../components/SeriesChartView'
import { SeriesTableView } from '../components/SeriesTableView'
import { SeriesDataLoadingView } from '../components/SeriesDataLoadingView'
import { Skeleton } from '../components/Skeleton'
import { SeriesDescription } from '../components/SeriesDescription'
import { SeriesSource } from '../components/SeriesSource'
import { SeriesLastUpdateStatus } from '../components/SeriesLastUpdateStatus'
import { ErrorState } from '../components/ErrorState'

import { SeriesMetadataProvider } from '../context/SeriesMetadataContext'
import clsx from 'clsx'
import { displayCountry } from '../utils/display-country'

export function SeriesDetails() {
  const { code: codeParam } = useParams()
  const code = z.string().catch('').parse(codeParam)

  const seriesMetadataQuery = useQuery({
    queryKey: ['seriesMetadata', code],
    queryFn: ({ signal }) => getSeriesMetadata(code, { signal }),
    enabled: code !== '',
  })

  const metadata = seriesMetadataQuery.data

  const error = seriesMetadataQuery.error || null
  if (error) {
    return (
      <div className='grid items-center'>
        <ErrorState
          title='Ocorreu um erro'
          description='Não foi possível obter os metadados da série. Por favor, tente novamente mais tarde.'
          retry={() => seriesMetadataQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <>
      <div className='mb-2'>
        <h3 className='inline text-3xl font-bold'>
          {metadata ? (
            metadata.name
          ) : (
            <Skeleton className='w-[20ch] max-w-full' />
          )}
        </h3>

        {metadata ? (
          <span className='pl-1 text-xl font-bold text-text-secondary'>
            ({code})
          </span>
        ) : null}
      </div>

      <div className='flex flex-row flex-wrap gap-2 mb-6'>
        {metadata ? (
          <Tag>Periodicidade: {displayPeriodicity(metadata.periodicity)}</Tag>
        ) : (
          <Skeleton className='w-[10ch]' />
        )}

        {metadata ? (
          <Tag>Tema: {metadata.theme}</Tag>
        ) : (
          <Skeleton className='w-[10ch]' />
        )}

        {metadata ? (
          <Tag>País: {displayCountry(metadata.countryCode)}</Tag>
        ) : (
          <Skeleton className='w-[10ch]' />
        )}
      </div>

      <SeriesDescription className={clsx('max-w-prose mb-4')}>
        {metadata ? (
          metadata.description
        ) : (
          <Skeleton className='w-full' count={4} />
        )}
      </SeriesDescription>

      <SeriesDataTabs
        className='full-bleed grid-app'
        chartContent={
          metadata ? (
            <SeriesMetadataProvider metadata={metadata}>
              <SeriesChartView code={code} />
            </SeriesMetadataProvider>
          ) : (
            <SeriesDataLoadingView />
          )
        }
        tableContent={
          metadata ? (
            <SeriesMetadataProvider metadata={metadata}>
              <SeriesTableView code={code} />
            </SeriesMetadataProvider>
          ) : (
            <SeriesDataLoadingView />
          )
        }
      />

      <div className={clsx('mt-4 my-2 space-y-1')}>
        <div className='text-text-secondary text-xs'>
          {metadata ? (
            <SeriesSource source={metadata.source} />
          ) : (
            <Skeleton>Banco Central do Brasil</Skeleton>
          )}
        </div>

        <div className='text-text-secondary text-xs'>
          {metadata ? (
            <SeriesLastUpdateStatus
              lastUpdatedAt={metadata.lastUpdatedAt}
              isActive={metadata.isActive}
            />
          ) : (
            <Skeleton>
              <SeriesLastUpdateStatus lastUpdatedAt={new Date()} isActive />
            </Skeleton>
          )}
        </div>
      </div>
    </>
  )
}

const periodicityDisplayNames: Record<SeriesPeriodicity, string> = {
  daily: 'Diária',
  monthly: 'Mensal',
  yearly: 'Anual',
  decennial: 'Decenal',
  quarterly: 'Semestral',
  quadrennial: 'Quaternal',
}

function displayPeriodicity(periodicity: SeriesPeriodicity) {
  return periodicityDisplayNames[periodicity]
}
