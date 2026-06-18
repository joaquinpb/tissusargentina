import { useRef } from 'react'
import { Upload, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button'
import { Badge } from '@/core/components/ui/badge'
import { useProductMutations } from '@/core/hooks/queries/useProductsQueries'
import { useAdminCategories } from '@/core/hooks/queries/useCategoriesQueries'
import { useCsvImport } from '../hooks/useCsvImport'
import { formatPrice } from '@/core/lib/utils'

export function CsvImportDialog({ open, onClose }) {
  const inputRef = useRef()
  const { data: categories = [] } = useAdminCategories()
  const { rows, errors, parseFile, reset } = useCsvImport(categories)
  const { bulkUpsert } = useProductMutations()

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleImport = async () => {
    if (!rows.length) return
    try {
      const result = await bulkUpsert.mutateAsync(rows)
      toast.success(`${result.length} productos importados correctamente`)
      handleClose()
    } catch (e) {
      toast.error(e.message || 'Error al importar')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar productos (CSV / Excel)</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary transition-colors"
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); parseFile(e.dataTransfer.files[0]) }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="mx-auto h-6 w-6 mb-2" />
            <p>Arrastrá un archivo CSV o Excel acá</p>
            <p className="text-xs mt-1">Columnas: name, category, price, stock, description, sku</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && parseFile(e.target.files[0])}
            />
          </div>

          {/* Errores de parseo */}
          {errors.length > 0 && (
            <div className="flex flex-col gap-1 text-sm text-destructive">
              {errors.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {e}
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Preview ({rows.length} productos)</p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Nombre</th>
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-right p-2">Precio</th>
                      <th className="text-right p-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">{r.name || <span className="text-destructive">—</span>}</td>
                        <td className="p-2 text-muted-foreground">
                          {categories.find(c => c.id === r.category_id)?.name || '—'}
                        </td>
                        <td className="p-2 text-right">{formatPrice(r.price)}</td>
                        <td className="p-2 text-right">{r.stock}</td>
                      </tr>
                    ))}
                    {rows.length > 10 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-center text-muted-foreground">
                          ...y {rows.length - 10} más
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button
            disabled={!rows.length || bulkUpsert.isPending}
            onClick={handleImport}
          >
            {bulkUpsert.isPending ? 'Importando...' : `Importar ${rows.length} productos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
