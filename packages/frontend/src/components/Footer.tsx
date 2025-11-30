import clsx from 'clsx'

type Props = React.ComponentPropsWithoutRef<'footer'>

export function Footer({ className, ...rest }: Props) {
  return (
    <footer
      className={clsx(
        'full-bleed',
        'grid-app',
        'border-t-1',
        'border-outline',
        'bg-surface-secondary',
        'py-6',
        'mt-6',
        className,
      )}
      {...rest}
    >
      <div
        className={clsx('grid gap-4', 'sm:grid-cols-[2fr_1fr]', 'items-center')}
      >
        <div className='text-text-secondary'>
          <p className='text-base mb-2'>
            Ferramenta de visualização e exploração de dados econômicos
            brasileiros.
          </p>
          <p className='text-xs'>
            Projeto independente, sem afiliação oficial com o Instituto de
            Pesquisa Econômica Aplicada (Ipea), utilizando dados obtidos através
            da API pública do Ipeadata.
          </p>
        </div>

        <div className='flex justify-start sm:justify-end items-center gap-2'>
          <a
            href='https://github.com/phelipetls/ipeadata-explorer'
            target='_blank'
            rel='noopener noreferrer'
            className={clsx(
              'inline-flex items-center gap-2',
              'px-4 py-2.5',
              'rounded-full',
              'bg-button-github-link',
              'text-text-on-github-link-button',
              'hover:bg-button-github-link-hover',
              'active:bg-button-github-link-active',
              'transition-colors',
              'text-sm font-semibold',
            )}
          >
            <img
              src='/github-mark-white.svg'
              alt=''
              width={18}
              height={18}
              className='inline-block brightness-0 invert'
            />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
