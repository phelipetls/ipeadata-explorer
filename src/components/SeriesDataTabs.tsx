import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { Tabs } from './Tabs'
import { LineChart, Table } from 'lucide-react'
import { type ReactNode } from 'react'

interface Props {
  chartContent: ReactNode
  tableContent: ReactNode
  className?: string
}

export function SeriesDataTabs({
  chartContent,
  tableContent,
  className,
}: Props) {
  const [selectedTab, setSelectedTab] = useQueryState(
    'view',
    parseAsStringLiteral(['chart', 'table']).withDefault('chart'),
  )

  return (
    <Tabs.Root
      value={selectedTab}
      onValueChange={(newTab) => {
        setSelectedTab(newTab)
      }}
      className={className}
    >
      <Tabs.List className='full-bleed mb-6'>
        <Tabs.Tab
          value='chart'
          isSelected={selectedTab === 'chart'}
          icon={<LineChart size={16} />}
        >
          Gráfico
        </Tabs.Tab>

        <Tabs.Tab
          value='table'
          isSelected={selectedTab === 'table'}
          icon={<Table size={16} />}
        >
          Tabela
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='chart'>{chartContent}</Tabs.Panel>
      <Tabs.Panel value='table'>{tableContent}</Tabs.Panel>
    </Tabs.Root>
  )
}
