import { useState } from 'react'
import { cn } from '@/core/lib/utils'

export function ProductGallery({ images = [], name }) {
  const [selected, setSelected] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        Sin imágenes
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
        <img src={images[selected]} alt={name} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
                selected === i ? 'border-primary' : 'border-transparent'
              )}
            >
              <img src={url} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
