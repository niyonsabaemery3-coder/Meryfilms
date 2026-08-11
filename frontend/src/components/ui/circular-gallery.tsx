import React, { useState, useEffect, useRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// A single item shown on the 3D ring.
export interface GalleryItem {
  common: string
  binomial: string
  photo: {
    url: string
    text: string
    pos?: string
    by: string
  }
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[]
  /** Distance of each card from the center — set smaller for compact sections. */
  radius?: number
  /** Speed of auto-rotation when the user isn't scrolling. */
  autoRotateSpeed?: number
  /** Card size in px — kept modest by default so the ring fits short sections. */
  cardWidth?: number
  cardHeight?: number
  /** Fires with the clicked item's index — wire this to navigation. */
  onItemClick?: (index: number) => void
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 420,
      autoRotateSpeed = 0.02,
      cardWidth = 210,
      cardHeight = 290,
      onItemClick,
      ...props
    },
    ref,
  ) => {
    const [rotation, setRotation] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    // Scroll-driven rotation — spin the ring as the page scrolls.
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
        setRotation(scrollProgress * 360)

        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      }
    }, [])

    // Gentle auto-rotation whenever the user isn't actively scrolling.
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) setRotation((prev) => prev + autoRotateSpeed)
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }, [isScrolling, autoRotateSpeed])

    const anglePerItem = 360 / items.length

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn('relative w-full h-full flex items-center justify-center', className)}
        style={{ perspective: '1600px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem
            const totalRotation = rotation % 360
            const relativeAngle = (itemAngle + totalRotation + 360) % 360
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180)

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <button
                  type="button"
                  onClick={() => onItemClick?.(i)}
                  aria-label={`Open ${item.common}`}
                  className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-reel-line bg-reel/70 backdrop-blur-lg text-left cursor-pointer"
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 text-parchment">
                    <h2 className="font-display text-lg sm:text-xl tracking-wide leading-none">{item.common}</h2>
                    <em className="block text-[11px] not-italic font-mono text-amber mt-1.5">{item.binomial}</em>
                    <p className="text-[11px] mt-1 text-fog font-mono truncate">{item.photo.by}</p>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)

CircularGallery.displayName = 'CircularGallery'

export { CircularGallery }
