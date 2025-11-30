interface Props {
  source: {
    name: string
    url: string
  }
}

const getDomain = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

export function SeriesSource({ source }: Props) {
  const renderSource = () => {
    const absoluteUrl = `//${source.url}`

    if (source.name) {
      return source.url ? (
        <a className='text-text-link' href={absoluteUrl}>
          {source.name}
        </a>
      ) : (
        source.name
      )
    }

    if (source.url) {
      return (
        <a className='text-text-link' href={absoluteUrl}>
          {getDomain(source.url)}
        </a>
      )
    }

    return 'Não disponível'
  }

  return <>Fonte: {renderSource()}</>
}
