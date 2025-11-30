import { mergeProps, useRender } from '@base-ui-components/react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'solid' | 'subtle' | 'text' | 'outline'
type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends useRender.ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export function Button({
  render,
  variant = 'solid',
  size = 'medium',
  startIcon,
  endIcon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        className: twMerge(
          clsx(
            'rounded-lg font-medium transition-colors',
            'disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2',
            {
              'px-2 h-[24px] text-xs [&_svg]:w-[1em] [&_svg]:h-[1em]':
                size === 'small',
              'px-3 h-[32px] text-sm [&_svg]:w-[1em] [&_svg]:h-[1em]':
                size === 'medium',
              'px-4 h-[40px] text-md [&_svg]:w-[1em] [&_svg]:h-[1em]':
                size === 'large',
            },
            {
              'bg-button-solid hover:bg-button-solid-hover active:bg-button-solid-active disabled:bg-button-solid-disabled':
                variant === 'solid',
              'text-text-on-solid-button disabled:text-text-on-solid-button-disabled':
                variant === 'solid',
              'bg-button-subtle hover:bg-button-subtle-hover active:bg-button-subtle-active disabled:bg-button-subtle-disabled':
                variant === 'subtle',
              'text-text-on-subtle-button disabled:text-text-on-subtle-button-disabled':
                variant === 'subtle',
              'bg-button-text hover:bg-button-text-hover active:bg-button-text-active disabled:bg-button-text-disabled':
                variant === 'text',
              'text-text-on-text-button hover:text-text-on-text-button-hover disabled:text-text-on-text-button-disabled':
                variant === 'text',
              'bg-button-outline hover:bg-button-outline-hover active:bg-button-outline-active disabled:bg-button-outline-disabled border border-border-outline hover:border-border-outline-hover active:border-border-outline-active disabled:border-border-outline-disabled text-text-on-outline-button hover:text-text-on-outline-button-hover disabled:text-text-on-outline-button-disabled':
                variant === 'outline',
            },
            className,
          ),
        ),
        children: (
          <>
            {startIcon && <span className='inline-flex'>{startIcon}</span>}
            {children}
            {endIcon && <span className='inline-flex'>{endIcon}</span>}
          </>
        ),
      },
      rest,
    ),
  })

  return element
}
