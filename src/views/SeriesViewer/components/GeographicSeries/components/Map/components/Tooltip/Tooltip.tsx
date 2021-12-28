import { Tooltip as MuiTooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import * as React from 'react'

const Tooltip = withStyles(() => ({
  tooltip: {
    fontSize: 13,
  },
}))(MuiTooltip)

interface Props {
  position: { x: number | undefined; y: number | undefined }
  title: string
  open: boolean
  children: JSX.Element
}

export function MapTooltip({ position, children, ...props }: Props) {
  if (!position.x || !position.y) return null

  return (
    <Tooltip
      {...props}
      PopperProps={{
        anchorEl: {
          clientHeight: 0,
          clientWidth: 0,
          getBoundingClientRect: () => ({
            top: position.y!,
            left: position.x!,
            right: position.x!,
            bottom: position.y!,
            width: 0,
            height: 0,
          }),
        },
      }}
    >
      {children}
    </Tooltip>
  )
}
