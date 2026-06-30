import { useState } from 'react'
import { cn } from '@/core/lib/utils'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/core/components/ui/dialog'
import { ZoomIn } from 'lucide-react'

export function ProductGallery({ images = [], name }) {
  const [selected, setSelected] = useState(0)

  if (!images.length) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border/50">
        Sin imágenes
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative w-full h-[350px] sm:h-[450px] md:h-[550px] rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-border/50 cursor-zoom-in transition-all hover:shadow-md flex items-center justify-center">
            <img 
              src={images[selected]} 
              alt={name} 
              className="max-w-full max-h-full w-auto h-auto object-contain p-4 sm:p-6 transition-transform duration-500 ease-out group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-sm">
                <ZoomIn className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-5xl w-[95vw] h-[95vh] p-2 sm:p-4 border-none bg-black/95 shadow-2xl [&>button>svg]:text-white">
          <DialogTitle className="sr-only">Imagen del producto</DialogTitle>
          <DialogDescription className="sr-only">Vista ampliada de la imagen del producto.</DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center bg-transparent">
            <img 
              src={images[selected]} 
              alt={name} 
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-md" 
            />
          </div>
        </DialogContent>
      </Dialog>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x pt-1 px-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                'flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start bg-white dark:bg-zinc-950 flex items-center justify-center',
                selected === i 
                  ? 'border-primary ring-4 ring-primary/10 ring-offset-background' 
                  : 'border-transparent hover:border-primary/40 opacity-60 hover:opacity-100 hover:shadow-sm'
              )}
            >
              <img 
                src={url} 
                alt={`${name} thumbnail ${i + 1}`} 
                className="max-w-full max-h-full w-auto h-auto object-contain p-1.5 transition-transform hover:scale-110" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
