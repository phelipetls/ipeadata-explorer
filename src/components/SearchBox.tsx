import { useRef, useState, useTransition, type ReactElement } from 'react'
import { search } from '../api/ipea/search'
import { parseAsString, useQueryState } from 'nuqs'
import { useQuery } from '@tanstack/react-query'
import { Autocomplete, mergeProps, useRender } from '@base-ui-components/react'
import { LoadingIndicator } from './LoadingIndicator'
import { SearchResultItem } from './SearchResultItem'

import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'

interface Props<ItemValue>
  extends Pick<Autocomplete.Root.Props<ItemValue>, 'open' | 'onOpenChange'> {
  renderInput?: ReactElement<Record<string, unknown>>
  renderBox?: ReactElement<Record<string, unknown>>
  renderTriggerButton?: ReactElement<Record<string, unknown>>
  renderStartIcon?: ReactElement<Record<string, unknown>>
  renderEndIcon?: ReactElement<Record<string, unknown>>
}

const INPUT_HEIGHT = 48
const ICON_SIZE = 48

const QUERY_PARAM = 'q'

export function SearchBox<ItemValue>({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  renderBox,
  renderTriggerButton,
  renderInput,
  renderStartIcon,
  renderEndIcon = (
    <div className='pointer-events-none'>
      <Search size={16} />
    </div>
  ),
  ...rest
}: Props<ItemValue>) {
  const navigate = useNavigate()

  const [uncontrolledOpen, uncontrolledOnOpenChange] = useState(false)

  const open = controlledOpen ?? uncontrolledOpen
  const onOpenChange = controlledOnOpenChange ?? uncontrolledOnOpenChange

  const [query, setQuery] = useQueryState(
    QUERY_PARAM,
    parseAsString.withDefault(''),
  )
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const searchQuery = useQuery({
    queryKey: ['search', query],
    queryFn: ({ signal }) => search(query, { signal }),
    enabled: open && query !== '',
  })

  const searchData = searchQuery.data ?? []

  let status = ''
  if (query === '') {
    status = 'Digite para começar a pesquisar'
  } else if (searchQuery.isLoading) {
    status = `Carregando resultados de pesquisa...`
  } else if (searchQuery.error) {
    status = `Ocorreu um erro inesperado ao pesquisar`
  } else if (searchData.length > 0) {
    status = `${searchData.length} resultados encontrados`
  } else {
    status = `Nenhum resultado encontrado`
  }

  const iconCommonProps = {
    className: 'flex items-center justify-center text-text-secondary',
  }

  const startIcon = useRender({
    defaultTagName: 'button',
    render: renderStartIcon,
    props: mergeProps<'button'>(
      {
        className: 'row-1 col-1',
      },
      iconCommonProps,
    ),
  })

  const endIcon = useRender({
    defaultTagName: 'button',
    render: renderEndIcon,
    props: mergeProps<'button'>(
      {
        className: 'row-1 col-3',
      },
      iconCommonProps,
    ),
  })

  const box = useRender({
    defaultTagName: 'div',
    render: renderBox,
    props: {
      style: {
        '--input-height': `${INPUT_HEIGHT}px`,
        '--icon-width': `${ICON_SIZE}px`,
        '--cols': `${ICON_SIZE}px 1fr ${ICON_SIZE}px`,
      } as React.CSSProperties,
      className: clsx('grid grid-cols-(--cols)'),
      children: (
        <>
          <Autocomplete.Input
            ref={inputRef}
            render={renderInput}
            placeholder='Pesquise por uma série...'
            className={clsx(
              'row-1',
              'col-span-full',
              'appearance-none',
              'bg-surface-tertiary',
              'h-(--input-height)',
              'rounded-[calc(var(--input-height)_/_2)]',
              'data-popup-open:rounded-b-none',
              'placeholder:text-input-placeholder',
              renderStartIcon ? 'pl-(--icon-width)' : 'pl-4',
              renderEndIcon ? 'pr-(--icon-width)' : 'pr-4',
              'border-1',
              'border-outline',
              'shadow-xs',
            )}
          />

          {renderStartIcon && startIcon}

          {renderEndIcon && endIcon}
        </>
      ),
    },
  })

  return (
    <Autocomplete.Root
      items={searchData}
      mode='none'
      filter={null}
      open={open}
      onOpenChange={onOpenChange}
      openOnInputClick
      defaultValue={query}
      onValueChange={(newValue, details) => {
        if (details.reason === 'input-change') {
          startTransition(() => {
            setQuery(newValue)
          })
        }
      }}
      {...rest}
    >
      {renderTriggerButton && (
        <Autocomplete.Trigger render={renderTriggerButton} />
      )}

      {box}

      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={0}>
          <Autocomplete.Popup
            className={clsx(
              'bg-surface-tertiary',
              'w-(--anchor-width)',
              'overflow-x-auto',
              'h-[var(--available-height)_-_--spacing(4)]',
              'max-h-screen',
              'rounded-lg',
              'rounded-t-none',
              'p-4',
              'border-1',
              'border-t-none',
              'border-outline',
            )}
          >
            <Autocomplete.Status className='sr-only'>
              {status}
            </Autocomplete.Status>

            {searchData.length > 0 ? (
              <Autocomplete.List render={<ul />}>
                {(item: NonNullable<typeof searchData>[number]) => {
                  const newSearchParams = new URLSearchParams()
                  newSearchParams.set(QUERY_PARAM, query)
                  return (
                    <Autocomplete.Item
                      key={item.code}
                      onClick={() => {
                        const url = `/series/${item.code}?${newSearchParams}`
                        navigate(url)
                        inputRef.current?.blur()
                      }}
                      render={(props, state) => {
                        return (
                          <li {...props}>
                            <SearchResultItem
                              value={item.name}
                              {...{
                                'data-highlighted': state.highlighted
                                  ? ''
                                  : undefined,
                                'data-selected': state.selected
                                  ? ''
                                  : undefined,
                                'data-disabled':
                                  state.disabled || isPending ? '' : undefined,
                              }}
                            >
                              {item.name}
                            </SearchResultItem>
                          </li>
                        )
                      }}
                    />
                  )
                }}
              </Autocomplete.List>
            ) : searchQuery.isLoading ? (
              <div className='grid place-items-center h-full'>
                <LoadingIndicator />
              </div>
            ) : (
              <Autocomplete.Empty className='grid place-items-center text-sm text-text-secondary'>
                {query === '' ? (
                  <span>Digite para começar a pequisar</span>
                ) : (
                  <span>Nenhum resultado encontrado para "{query}"</span>
                )}
              </Autocomplete.Empty>
            )}
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}
