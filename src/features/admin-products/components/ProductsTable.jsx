import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Badge } from '@/core/components/ui/badge'
import { Input } from '@/core/components/ui/input'
import { Skeleton } from '@/core/components/ui/skeleton'
import { useConfirm } from '@/core/context/ConfirmContext'
import { useProductMutations } from '@/core/hooks/queries/useProductsQueries'
import { formatPrice } from '@/core/lib/utils'

function StockCell({ product }) {
  const { update } = useProductMutations()
  const [value, setValue] = useState(product.stock)
  const [editing, setEditing] = useState(false)

  const save = async () => {
    setEditing(false)
    if (Number(value) !== product.stock) {
      try {
        await update.mutateAsync({ id: product.id, stock: Number(value) })
      } catch {
        setValue(product.stock)
      }
    }
  }

  if (editing) {
    return (
      <Input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === 'Enter' && save()}
        className="w-20 h-7 text-xs"
        autoFocus
      />
    )
  }

  return (
    <button onClick={() => setEditing(true)} className="text-sm hover:underline underline-offset-2">
      {product.stock}
    </button>
  )
}

export function ProductsTable({ products, isLoading, onEdit }) {
  const confirm = useConfirm()
  const { update, remove } = useProductMutations()

  const handleToggleActive = async (product) => {
    try {
      await update.mutateAsync({ id: product.id, is_active: !product.is_active })
    } catch {
      toast.error('Error al cambiar estado')
    }
  }

  const handleDelete = async (product) => {
    const ok = await confirm({
      title: 'Eliminar producto',
      description: `¿Eliminás "${product.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      variant: 'destructive',
    })
    if (!ok) return
    try {
      await remove.mutateAsync(product.id)
      toast.success('Producto eliminado')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    )
  }

  if (!products?.length) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No hay productos. Creá uno o importá desde CSV.</p>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs">
          <tr>
            <th className="text-left p-3">Producto</th>
            <th className="text-left p-3 hidden md:table-cell">Categoría</th>
            <th className="text-right p-3">Precio</th>
            <th className="text-right p-3">Stock</th>
            <th className="text-center p-3">Estado</th>
            <th className="text-right p-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-muted shrink-0" />
                  )}
                  <span className="font-medium line-clamp-1">{p.name}</span>
                </div>
              </td>
              <td className="p-3 text-muted-foreground hidden md:table-cell">
                {p.categories?.name || '—'}
              </td>
              <td className="p-3 text-right">{formatPrice(p.price)}</td>
              <td className="p-3 text-right"><StockCell product={p} /></td>
              <td className="p-3 text-center">
                <Badge variant={p.is_active ? 'default' : 'secondary'}>
                  {p.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    title={p.is_active ? 'Desactivar' : 'Activar'}
                    onClick={() => handleToggleActive(p)}
                  >
                    {p.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(p)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
