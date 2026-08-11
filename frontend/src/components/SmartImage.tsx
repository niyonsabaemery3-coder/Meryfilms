import { useState, ImgHTMLAttributes } from 'react'
import { Film } from 'lucide-react'
import { cn } from '../lib/utils'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string
  // When an image never loads (missing file, bad URL from an admin upload,
  // dead CDN link) most sites — oshakurfilms.com included — silently fall
  // back to a generic icon or show nothing at all. We show a poster-shaped,
  // on-brand placeholder instead, so a broken image never looks broken.
  fallbackLabel?: string
}

// Poster/backdrop image with three states: shimmering placeholder while
// loading, the real image once it decodes, or a branded placeholder if the
// source 404s. Every list of movies (Home, MovieRow, Hero, admin tables)
// should render posters through this instead of a raw <img>.
export default function SmartImage({
  wrapperClassName,
  fallbackLabel,
  className,
  alt,
  onLoad,
  onError,
  ...imgProps
}: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className={cn('relative overflow-hidden bg-reel w-full', wrapperClassName)}>
      {status !== 'error' && (
        <img
          {...imgProps}
          alt={alt}
          loading={imgProps.loading ?? 'lazy'}
          decoding="async"
          className={cn(
            'absolute inset-0 h-full w-full',
            className,
            'transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={(e) => {
            setStatus('loaded')
            onLoad?.(e)
          }}
          onError={(e) => {
            setStatus('error')
            onError?.(e)
          }}
        />
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-reel via-void-soft to-reel" aria-hidden />
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-reel text-fog px-3 text-center">
          <Film size={28} className="text-reel-line" />
          <span className="text-[11px] font-mono leading-tight line-clamp-2">
            {fallbackLabel ?? alt ?? 'MeryFilms'}
          </span>
        </div>
      )}
    </div>
  )
}
