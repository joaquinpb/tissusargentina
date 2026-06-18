import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/core/components/ui/sheet'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Textarea } from '@/core/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/core/components/ui/select'
import { useProductMutations } from '@/core/hooks/queries/useProductsQueries'
import { useAdminCategories } from '@/core/hooks/queries/useCategoriesQueries'
import { ImageUploader } from './ImageUploader'
import { slugify } from '@/core/lib/utils'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.preprocess((v) => (v === '' || v == null ? null : Number(v)), z.number().positive().nullable()),
  stock: z.preprocess((v) => Number(v) || 0, z.number().int().min(0)),
  sku: z.string().optional(),
  category_id: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
})

export function ProductFormSheet({ product, open, onClose }) {
  const { create, update } = useProductMutations()
  const { data: categories = [] } = useAdminCategories()
  const [images, setImages] = useState(product?.images || [])
  const isEditing = Boolean(product)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price ?? '',
      stock: product?.stock ?? 0,
      sku: product?.sku || '',
      category_id: product?.category_id || null,
      is_active: product?.is_active ?? true,
      is_featured: product?.is_featured ?? false,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price ?? '',
        stock: product?.stock ?? 0,
        sku: product?.sku || '',
        category_id: product?.category_id || null,
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
      })
      setImages(product?.images || [])
    }
  }, [open, product])

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      slug: product?.slug || slugify(values.name),
      images,
      specifications: product?.specifications || {},
    }
    try {
      if (isEditing) {
        await update.mutateAsync({ id: product.id, ...payload })
        toast.success('Producto actualizado')
      } else {
        await create.mutateAsync(payload)
        toast.success('Producto creado')
      }
      onClose()
    } catch (e) {
      toast.error(e.message || 'Error al guardar el producto')
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre *</Label>
            <Input {...register('name')} placeholder="Mesa de pool 8 pies" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Precio (ARS)</Label>
              <Input type="number" step="0.01" {...register('price')} placeholder="Dejar vacío = consultar" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Stock *</Label>
              <Input type="number" min="0" {...register('stock')} />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Categoría</Label>
              <Select
                value={watch('category_id') || ''}
                onValueChange={(v) => setValue('category_id', v || null)}
              >
                <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin categoría</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>SKU</Label>
              <Input {...register('sku')} placeholder="Código interno" />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" {...register('is_active')} className="accent-primary" />
              Activo
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" {...register('is_featured')} className="accent-primary" />
              Destacado
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Descripción</Label>
            <Textarea {...register('description')} rows={4} placeholder="Descripción del producto..." />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Imágenes</Label>
            <ImageUploader productId={product?.id} images={images} onChange={setImages} />
          </div>

          <SheetFooter className="mt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
