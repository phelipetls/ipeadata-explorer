import React from 'react'

interface Props extends React.ComponentPropsWithoutRef<'thead'> {
  children: React.ReactNode
}

export function TableHead({ children, ...rest }: Props) {
  return <thead {...rest}>{children}</thead>
}
