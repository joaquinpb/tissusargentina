import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, Upload, GripVertical } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { uploadProductImage } from '@/core/services/api'
import { cn } from '@/core/lib/utils'

function SortableImage({ url, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('relative group rounded-md overflow-hidden border aspect-square bg-muted', isDragging && 'opacity-50 z-50')}
    >
      <img src={url} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
        <button {...attributes} {...listeners} className="p-1 rounded bg-white/20 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-white" />
        </button>
        <button onClick={() => onRemove(url)} className="p-1 rounded bg-white/20">
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  )
}

export function ImageUploader({ productId, images = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleFiles = useCallback(async (files) => {
    setUploading(true)
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadProductImage(f, productId || 'temp'))
      )
      onChange([...images, ...urls])
    } finally {
      setUploading(false)
    }
  }, [images, onChange, productId])

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleRemove = (url) => onChange(images.filter((u) => u !== url))

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIdx = images.indexOf(active.id)
      const newIdx = images.indexOf(over.id)
      onChange(arrayMove(images, oldIdx, newIdx))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground hover:border-primary transition-colors"
      >
        <Upload className="mx-auto h-6 w-6 mb-2" />
        <p>Arrastrá imágenes acá o</p>
        <label className="mt-1 inline-block cursor-pointer text-primary underline underline-offset-2">
          seleccioná archivos
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
        {uploading && <p className="mt-1">Subiendo...</p>}
      </div>

      {/* Grid de imágenes */}
      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 gap-2">
              {images.map((url) => (
                <SortableImage key={url} url={url} onRemove={handleRemove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
