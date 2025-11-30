type Bin = {
  color: string
  minLabel: string
  maxLabel?: string
}

type Props = React.ComponentPropsWithRef<'div'> & {
  bins: Bin[]
  label: string
  width: number
  height: number
  hoveredBinIndex?: number
}

export function ChoroplethMapLegend({
  bins,
  label,
  width,
  height,
  hoveredBinIndex = -1,
  className,
  ...rest
}: Props) {
  const binWidth = width / bins.length

  return (
    <div className={className} style={{ width }} {...rest}>
      <div className='text-xs font-bold mb-4'>{label}</div>

      <div className='relative'>
        <div className='flex' style={{ height }}>
          {bins.map((bin, i) => (
            <div
              key={i}
              style={{
                width: binWidth,
                backgroundColor: bin.color,
                border:
                  i === hoveredBinIndex ? '2px solid currentColor' : 'none',
                boxSizing: 'border-box',
              }}
            />
          ))}
        </div>

        <div className='relative' style={{ height: 35 }}>
          {bins.map((bin, i) => (
            <div key={i}>
              <div className='absolute' style={{ left: i * binWidth }}>
                <div
                  className='border-l border-current'
                  style={{ height: 10 }}
                />
                <div
                  className='text-xs absolute whitespace-nowrap'
                  style={{
                    top: 15,
                    left: 0,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {bin.minLabel}
                </div>
              </div>

              {bin.maxLabel && (
                <div className='absolute' style={{ left: (i + 1) * binWidth }}>
                  <div
                    className='border-l border-current'
                    style={{ height: 10 }}
                  />
                  <div
                    className='text-xs absolute whitespace-nowrap'
                    style={{
                      top: 15,
                      left: 0,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {bin.maxLabel}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
