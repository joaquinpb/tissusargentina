import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Skeleton } from '@/core/components/ui/skeleton'
import { useConfirm } from '@/core/context/ConfirmContext'
import { useCategoryMutations } from '@/core/hooks/queries/useCategoriesQueries'

export function CategoriesTable({ categories, isLoading, onEdit }) {
  const confirm = useConfirm()
  const { remove } = useCategoryMutations()

  const handleDelete = async (category) => {
    const ok = await confirm({
      title: 'Eliminar categoría',
      description: `¿Eliminás "${category.name}"? Los productos quedarán sin categoría.`,
      confirmText: 'Eliminar',
      variant: 'destructive',
    })
    if (!ok) return
    try {
      await remove.mutateAsync(category.id)
      toast.success('Categoría eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  if (isLoading) {
    return <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
  }

  if (!categories?.length) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No hay categorías. Creá una para organizar tus productos.</p>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs">
          <tr>
            <th className="text-left p-3">Nombre</th>
            <th className="text-left p-3 hidden md:table-cell">Descripción</th>
            <th className="text-center p-3">Posición</th>
            <th className="text-right p-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {c.image_url && (
                    <img src={c.image_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                  )}
                  <span className="font-medium">{c.name}</span>
                </div>
              </td>
              <td className="p-3 text-muted-foreground hidden md:table-cell line-clamp-1">
                {c.description || '—'}
              </td>
              <td className="p-3 text-center text-muted-foreground">{c.position}</td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(c)}
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
