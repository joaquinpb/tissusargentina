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
import { slugify, cn } from '@/core/lib/utils'
import { 
  Sparkles, 
  Package, 
  Tag, 
  DollarSign, 
  Barcode, 
  Eye, 
  FileText, 
  Image as ImageIcon,
  AlertCircle,
  Hash
} from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.preprocess((v) => (v === '' || v == null ? null : Number(v)), z.number().positive().nullable()),
  stock: z.preprocess((v) => Number(v) || 0, z.number().int().min(0)),
  sku: z.string().optional(),
  category_id: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  discount_percentage: z.preprocess((v) => Number(v) || 0, z.number().int().min(0).max(100)),
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
      discount_percentage: product?.discount_percentage ?? 0,
    },
  })

  // Explicitly register custom fields (category_id)
  useEffect(() => {
    register('category_id')
  }, [register])

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
        discount_percentage: product?.discount_percentage ?? 0,
      })
      setImages(product?.images || [])
    }
  }, [open, product, reset])

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
        toast.success('Producto actualizado con éxito')
      } else {
        await create.mutateAsync(payload)
        toast.success('Producto creado con éxito')
      }
      onClose()
    } catch (e) {
      toast.error(e.message || 'Error al guardar el producto')
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl h-full flex flex-col p-0 gap-0 overflow-hidden">
        <SheetHeader className="px-6 py-5 border-b border-border flex-shrink-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            {isEditing ? (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                Editar Producto
              </>
            ) : (
              <>
                <Package className="h-5 w-5 text-primary" />
                Nuevo Producto
              </>
            )}
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {isEditing 
              ? 'Modifica los detalles del producto y guarda los cambios.' 
              : 'Completa la información básica y añade imágenes del nuevo producto.'}
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          <div className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Tag className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información Básica</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-medium text-sm">Nombre del Producto *</Label>
              <Input {...register('name')} placeholder="Ej. Mesa de pool 8 pies" className="focus-visible:ring-primary" />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="font-medium text-sm">Categoría</Label>
                <Select
                  value={watch('category_id') || 'none'}
                  onValueChange={(v) => setValue('category_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger className="w-full focus:ring-primary">
                    <SelectValue placeholder="Sin categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="font-medium text-sm">SKU / Código Único</Label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                  <Input {...register('sku')} placeholder="Ej. SKU-POOL-001" className="pl-9 focus-visible:ring-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PRECIOS E INVENTARIO */}
          <div className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <DollarSign className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio e Inventario</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="font-medium text-sm flex items-center gap-1">
                  Precio
                  <span className="text-xs text-muted-foreground font-normal">(ARS)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/70 font-semibold">$</span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register('price')} 
                    placeholder="Consultar precio" 
                    className="pl-7 focus-visible:ring-primary" 
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Dejar vacío para mostrar como "Consultar precio" (ideal para cotizaciones).
                </p>
                {errors.price && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="font-medium text-sm">Stock Disponible *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                  <Input 
                    type="number" 
                    min="0" 
                    {...register('stock')} 
                    className="pl-9 focus-visible:ring-primary" 
                  />
                </div>
                {errors.stock && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label className="font-medium text-sm">Porcentaje de Descuento</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/70 font-semibold">%</span>
                  <Input 
                    type="number" 
                    min="0"
                    max="100"
                    {...register('discount_percentage')} 
                    placeholder="0" 
                    className="pl-7 focus-visible:ring-primary" 
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Dejar en 0 si no está en promoción.
                </p>
                {errors.discount_percentage && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.discount_percentage.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: ESTADO Y VISIBILIDAD */}
          <div className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Eye className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado y Visibilidad</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={cn(
                "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none",
                watch('is_active') 
                  ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.08]" 
                  : "border-border hover:border-muted-foreground/25 hover:bg-muted/10"
              )}>
                <input 
                  type="checkbox" 
                  {...register('is_active')} 
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer" 
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">Activo</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">Visible en la tienda para los clientes.</span>
                </div>
              </label>

              <label className={cn(
                "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none",
                watch('is_featured') 
                  ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.08]" 
                  : "border-border hover:border-muted-foreground/25 hover:bg-muted/10"
              )}>
                <input 
                  type="checkbox" 
                  {...register('is_featured')} 
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer" 
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">Destacado</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">Aparecerá en la sección del inicio de la web.</span>
                </div>
              </label>
            </div>
          </div>

          {/* SECCIÓN 4: DESCRIPCIÓN */}
          <div className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles y Descripción</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-medium text-sm">Descripción del Producto</Label>
              <Textarea 
                {...register('description')} 
                rows={4} 
                placeholder="Detalla las características físicas, medidas, materiales, etc." 
                className="focus-visible:ring-primary resize-y min-h-[100px]"
              />
            </div>
          </div>

          {/* SECCIÓN 5: IMÁGENES */}
          <div className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <ImageIcon className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Imágenes del Producto</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <ImageUploader productId={product?.id} images={images} onChange={setImages} />
            </div>
          </div>
        </form>

        <SheetFooter className="px-6 py-4 border-t border-border bg-muted/20 dark:bg-muted/10 flex-shrink-0 flex-row justify-end gap-3 mt-0">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)} className="min-w-[120px]">
            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

