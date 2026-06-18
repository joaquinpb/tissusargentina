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
import { useCategoryMutations } from '@/core/hooks/queries/useCategoriesQueries'
import { uploadCategoryImage } from '@/core/services/api'
import { slugify } from '@/core/lib/utils'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  position: z.preprocess((v) => Number(v) || 0, z.number().int().min(0)),
})

export function CategoryFormSheet({ category, open, onClose }) {
  const { create, update } = useCategoryMutations()
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(category?.image_url || '')
  const isEditing = Boolean(category)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      position: category?.position ?? 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name || '',
        description: category?.description || '',
        position: category?.position ?? 0,
      })
      setPreview(category?.image_url || '')
      setImageFile(null)
    }
  }, [open, category])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values) => {
    try {
      let image_url = category?.image_url || null
      if (imageFile) {
        image_url = await uploadCategoryImage(imageFile, category?.id)
      }
      const payload = { ...values, slug: slugify(values.name), image_url }
      if (isEditing) {
        await update.mutateAsync({ id: category.id, ...payload })
        toast.success('Categoría actualizada')
      } else {
        await create.mutateAsync(payload)
        toast.success('Categoría creada')
      }
      onClose()
    } catch (e) {
      toast.error(e.message || 'Error al guardar')
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Editar categoría' : 'Nueva categoría'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre *</Label>
            <Input {...register('name')} placeholder="Mesas de pool" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Descripción</Label>
            <Textarea {...register('description')} rows={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Posición (orden en catálogo)</Label>
            <Input type="number" min="0" {...register('position')} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Imagen de banner</Label>
            {preview && (
              <img src={preview} alt="" className="w-full aspect-video object-cover rounded-md mb-2" />
            )}
            <Input type="file" accept="image/*" onChange={handleImageChange} />
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
