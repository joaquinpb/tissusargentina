import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/core/components/ui/skeleton'

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-[200px] sm:w-[260px] md:w-[280px] shrink-0">
      <Skeleton className="aspect-square rounded-md" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

export function ProductCarousel({ products, isLoading }) {
  const containerRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      // Allow a tiny margin of 2px for subpixel rendering precision
      setIsOverflowing(scrollWidth > clientWidth + 2)
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
    }
  }

  useEffect(() => {
    checkScroll()
    
    // Setup observer and resize listener
    window.addEventListener('resize', checkScroll)
    
    // Also use ResizeObserver for more reliable size detection
    let resizeObserver
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        checkScroll()
      })
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', checkScroll)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [products, isLoading])

  const scroll = (direction) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current
      // Scroll by 80% of client width to keep visual context
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
        <p className="text-lg font-medium">No se encontraron productos</p>
        <p className="text-sm text-muted-foreground">Intentá con otros filtros o volvé más tarde.</p>
      </div>
    )
  }

  return (
    <div className="relative group/carousel px-1">
      {/* Scroll area */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className={`flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none ${
          !isOverflowing ? 'justify-start md:justify-center' : ''
        }`}
      >
        {products.map((p) => (
          <div key={p.id} className="w-[200px] sm:w-[260px] md:w-[280px] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {isOverflowing && (
        <>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-[-16px] top-1/2 -translate-y-1/2 rounded-full shadow-md bg-background/95 hover:bg-background z-10 hidden md:flex transition-opacity duration-200"
              onClick={() => scroll('left')}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-[-16px] top-1/2 -translate-y-1/2 rounded-full shadow-md bg-background/95 hover:bg-background z-10 hidden md:flex transition-opacity duration-200"
              onClick={() => scroll('right')}
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </>
      )}
    </div>
  )
}
