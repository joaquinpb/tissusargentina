import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button'
import { useProductMutations } from '@/core/hooks/queries/useProductsQueries'
import { ImageUploader } from './ImageUploader'
import { Image as ImageIcon } from 'lucide-react'

export function ProductImagesDialog({ product, open, onClose }) {
  const { update } = useProductMutations()
  const [images, setImages] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setImages(product?.images || [])
    }
  }, [open, product])

  const handleSave = async () => {
    if (!product) return
    setIsSaving(true)
    try {
      await update.mutateAsync({ id: product.id, images })
      toast.success('Imágenes actualizadas con éxito')
      onClose()
    } catch (e) {
      toast.error(e.message || 'Error al actualizar imágenes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Imágenes de {product?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ImageUploader 
            productId={product?.id} 
            images={images} 
            onChange={setImages} 
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Imágenes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
