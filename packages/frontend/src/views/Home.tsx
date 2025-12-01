import * as HomeTabs from '../components/HomeTabs'
import { HomeSeriesListItem } from '../components/HomeSeriesListItem'
import { HomeSeriesList } from '../components/HomeSeriesList'
import { TrendingUp, MapPin, Users } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import clsx from 'clsx'
import { HomeSeriesChartSection } from '../components/HomeSeriesChartSection'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { format, subYears } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { getSeriesMetadata } from '../api/ipea/get-series-metadata'

export type SeriesItem = {
  label: string
  code: string
  regionalDivision: 'brazil' | 'regions' | 'states' | 'municipalities'
  getDateRange: (maxDate: Date) => { startDate: Date; endDate: Date }
  dimensions: {
    height: number
    marginTop: number
    marginRight: number
    marginLeft: number
    marginBottom: number
  }
}

const getLast10YearsRange = (maxDate: Date) => ({
  startDate: subYears(maxDate, 10),
  endDate: maxDate,
})

const getSingleDateRange = (maxDate: Date) => ({
  startDate: maxDate,
  endDate: maxDate,
})

const lineChartDimensions = {
  height: 400,
  marginTop: 30,
  marginRight: 0,
  marginLeft: 0,
  marginBottom: 0,
}

const mapChartDimensions = {
  height: 500,
  marginTop: 0,
  marginRight: 0,
  marginLeft: 0,
  marginBottom: 60,
}

const macroeconomicSeries: SeriesItem[] = [
  {
    label: 'Taxa de juros - CDI / Over',
    code: 'BM12_TJCDI12',
    regionalDivision: 'brazil',
    getDateRange: getLast10YearsRange,
    dimensions: lineChartDimensions,
  },
  {
    label: 'IPCA',
    code: 'PRECOS12_IPCA12',
    regionalDivision: 'brazil',
    getDateRange: getLast10YearsRange,
    dimensions: lineChartDimensions,
  },
  {
    label: 'IGP',
    code: 'IGP12_IGPDI12',
    regionalDivision: 'brazil',
    getDateRange: getLast10YearsRange,
    dimensions: lineChartDimensions,
  },
  {
    label: 'Selic',
    code: 'BM366_TJOVER366',
    regionalDivision: 'brazil',
    getDateRange: getLast10YearsRange,
    dimensions: lineChartDimensions,
  },
  {
    label: 'Salário mínimo real',
    code: 'GAC12_SALMINRE12',
    regionalDivision: 'brazil',
    getDateRange: getLast10YearsRange,
    dimensions: lineChartDimensions,
  },
  {
    label: 'Taxa de câmbio',
    code: 'BM12_ERC12',
    regionalDivision: 'brazil',
    getDateRange: getLast10YearsRange,
    dimensions: lineChartDimensions,
  },
]

const regionalSeries: SeriesItem[] = [
  {
    label: 'Desemprego',
    code: 'PNADCT_TXDSCUPUF',
    regionalDivision: 'states',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'Renda per capita',
    code: 'ADH_RDPC',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'PIB Estadual',
    code: 'PIBE',
    regionalDivision: 'states',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'Receita Estadual',
    code: 'RECORRE',
    regionalDivision: 'states',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'População',
    code: 'POPTOT',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
]

const socialSeries: SeriesItem[] = [
  {
    label: 'IDH Municipal',
    code: 'ADH_IDHM',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'Mortalidade Infantil',
    code: 'ADH_MORT1',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'Desemprego',
    code: 'PNADCT_TXDSCUPUF',
    regionalDivision: 'states',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'Índice de Gini',
    code: 'ADH_GINI',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'IDH Educação',
    code: 'ADH_IDHM_E',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
  {
    label: 'Esperança de Vida',
    code: 'ADH_ESPVIDA',
    regionalDivision: 'municipalities',
    getDateRange: getSingleDateRange,
    dimensions: mapChartDimensions,
  },
]

export function Home() {
  const sections = [
    {
      id: 'macro',
      label: 'Macroeconômico',
      description: 'Principais indicadores nacionais',
      icon: <TrendingUp size={20} />,
      items: macroeconomicSeries,
      styles: {
        '--section-primary': 'var(--color-blue-500)',
        '--section-surface-hover': 'var(--color-blue-100)',
        '--current-section-surface': 'var(--color-blue-50)',
        '--current-section-surface-hover': 'var(--color-blue-100)',
        '--current-section-outline': 'var(--color-blue-300)',
      },
    },
    {
      id: 'regional',
      label: 'Regional',
      description: 'Dados por estados e municípios',
      icon: <MapPin size={20} />,
      items: regionalSeries,
      styles: {
        '--section-primary': 'var(--color-green-500)',
        '--section-surface-hover': 'var(--color-green-100)',
        '--current-section-surface': 'var(--color-green-50)',
        '--current-section-surface-hover': 'var(--color-green-100)',
        '--current-section-outline': 'var(--color-green-300)',
      },
    },
    {
      id: 'social',
      label: 'Social',
      description: 'Indicadores sociais e demográficos',
      icon: <Users size={20} />,
      items: socialSeries,
      styles: {
        '--section-primary': 'var(--color-rose-500)',
        '--section-surface-hover': 'var(--color-rose-100)',
        '--current-section-surface': 'var(--color-rose-100)',
        '--current-section-surface-hover': 'var(--color-rose-200)',
        '--current-section-outline': 'var(--color-rose-300)',
      },
    },
  ].filter((v) => v !== null)

  const [activeSectionId, setActiveSectionId] = useState('macro')

  const [selectedSeriesCode, setSelectedSeriesCode] =
    useState<string>('BM12_TJCDI12')

  const selectedSeries =
    sections
      .find((s) => s.id === activeSectionId)
      ?.items.find((item) => item.code === selectedSeriesCode) ?? null

  const deferredSelectedSeries = useDeferredValue(selectedSeries)

  const isPending = selectedSeries !== deferredSelectedSeries

  const { data: metadata } = useQuery({
    queryKey: ['seriesMetadata', deferredSelectedSeries?.code],
    queryFn: ({ signal }) =>
      deferredSelectedSeries
        ? getSeriesMetadata(deferredSelectedSeries.code, { signal })
        : null,
    enabled: !!deferredSelectedSeries,
  })

  const dateRange =
    deferredSelectedSeries && metadata
      ? deferredSelectedSeries.getDateRange(metadata.maxDate)
      : null

  let seriesDetailsUrl = `/series/${deferredSelectedSeries?.code}`

  if (dateRange && deferredSelectedSeries) {
    const params = new URLSearchParams({
      startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
      endDate: format(dateRange.endDate, 'yyyy-MM-dd'),
      preset: 'custom',
      regionalDivision: deferredSelectedSeries.regionalDivision,
    })
    seriesDetailsUrl += `?${params.toString()}`
  }

  return (
    <HomeTabs.Root
      value={activeSectionId}
      onValueChange={(newActiveSectionId) => {
        setActiveSectionId(newActiveSectionId)
        setSelectedSeriesCode(
          sections.find((s) => s.id === newActiveSectionId)?.items[0]?.code ??
            '',
        )
      }}
      className='full-bleed grid-app'
    >
      <div className='full-bleed grid-app overflow-x-auto pb-2'>
        <HomeTabs.List className='flex flex-row gap-2'>
          {sections.map((section) => {
            const isActive = section.id === activeSectionId
            return (
              <HomeTabs.Tab
                key={section.id}
                value={section.id}
                icon={section.icon}
                title={
                  <span
                    className={clsx(
                      isActive
                        ? 'font-bold text-(--section-primary)'
                        : 'text-text-secondary group-hover:text-(--section-primary)',
                    )}
                  >
                    {section.label}
                  </span>
                }
                description={section.description}
                style={section.styles as React.CSSProperties}
                className={clsx(
                  'group flex-1 rounded-xl border-1 [&_svg]:text-(--section-primary)',
                  isActive
                    ? 'bg-(--current-section-surface) hover:bg-(--current-section-surface-hover) border-(--current-section-outline)'
                    : 'bg-surface-secondary hover:bg-(--section-surface-hover) border-outline hover:border-(--current-section-outline)',
                )}
              />
            )
          })}
        </HomeTabs.List>
      </div>

      {sections.map((section) => (
        <HomeTabs.Panel
          key={section.id}
          value={section.id}
          style={section.styles as React.CSSProperties}
          className={'grid-app full-bleed'}
        >
          <div className='grid-app full-bleed overflow-x-auto py-2'>
            <HomeSeriesList>
              {section.items.map((item) => {
                const isActive = selectedSeriesCode === item.code
                return (
                  <HomeSeriesListItem
                    key={item.code}
                    label={item.label}
                    isActive={isActive}
                    onClick={() => {
                      setSelectedSeriesCode(item.code)
                    }}
                    className={clsx(
                      isActive &&
                        'text-(--section-primary) bg-(--current-section-surface) hover:bg-(--current-section-surface-hover) active:bg-(--current-section-surface-hover) border-1 border-(--current-section-outline)',
                    )}
                  />
                )
              })}
            </HomeSeriesList>
          </div>

          {deferredSelectedSeries && (
            <div className={'full-bleed grid-app mt-4'}>
              <Link
                to={seriesDetailsUrl}
                className='inline-block mb-2'
                viewTransition
              >
                <h2 className='font-bold text-2xl flex flex-row gap-2 items-center view-transition-[series-title]'>
                  {selectedSeries?.label}
                  <ChevronRight size='24px' className='text-text-secondary' />
                </h2>
              </Link>

              <div
                className={clsx(
                  'full-bleed grid-app py-4 border-y-1 border-outline',
                  isPending
                    ? 'bg-surface-secondary'
                    : 'bg-(--current-section-surface)',
                )}
              >
                <HomeSeriesChartSection
                  selectedSeries={deferredSelectedSeries}
                  className={clsx(
                    'border-1 border-(--current-section-outline)',
                    isPending && 'opacity-75',
                  )}
                  dimensions={deferredSelectedSeries.dimensions}
                />
              </div>
            </div>
          )}
        </HomeTabs.Panel>
      ))}
    </HomeTabs.Root>
  )
}
