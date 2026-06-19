import { useRef } from 'react'
import { Upload, AlertCircle, FileSpreadsheet, Download, Info } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button'
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
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 gap-5 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Importar Productos (Excel / CSV)
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Instrucciones y Descarga */}
          <div className="space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs text-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Instrucciones y Descarga</h3>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Puedes subir la lista de tus productos utilizando un archivo de Excel (<strong>.xlsx</strong>) o de valores separados por comas (<strong>.csv</strong>). 
              Para evitar errores de estructura, descarga la plantilla, completa los datos de tus productos y vuelve a subirla aquí.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <a href="/template_productos.xlsx" download="template_productos.xlsx">
                <Button type="button" variant="outline" size="sm" className="gap-2 text-xs cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  Descargar Plantilla Excel
                </Button>
              </a>
              <a href="/template_productos.csv" download="template_productos.csv">
                <Button type="button" variant="outline" size="sm" className="gap-2 text-xs cursor-pointer">
                  <Download className="h-4 w-4 text-blue-600" />
                  Descargar Plantilla CSV
                </Button>
              </a>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-2 border border-border">
              <p className="font-semibold text-foreground">💡 Indicaciones clave para el archivo:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1.5 pl-1">
                <li>
                  Las categorías indicadas deben coincidir exactamente con el nombre de las categorías ya creadas en el sistema para que se asocien bien.
                </li>
                <li>
                  El precio debe escribirse sin símbolos ni comas de miles (ej. <strong>1500000</strong>). Déjalo en blanco si prefieres mostrar "Consultar precio".
                </li>
                <li>
                  <strong>Cómo guardar CSV en Excel:</strong> Si editas el archivo en Excel y decides exportarlo como CSV, ve a <strong>Archivo &gt; Guardar como</strong>, elige tu carpeta, y en el desplegable de tipo de archivo selecciona <strong>CSV (delimitado por comas) (*.csv)</strong>.
                </li>
              </ul>
            </div>
          </div>

          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center text-sm text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 group"
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); parseFile(e.dataTransfer.files[0]) }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-7 w-7 text-muted-foreground/70 group-hover:text-primary transition-colors duration-200" />
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground group-hover:text-primary">
                Arrastra tu archivo CSV o Excel aquí
              </p>
              <p className="text-xs text-muted-foreground/80">
                O haz clic para seleccionar un archivo desde tu dispositivo
              </p>
            </div>
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
            <div className="flex flex-col gap-1.5 text-xs text-destructive p-4 rounded-xl border border-destructive/20 bg-destructive/5">
              <p className="font-semibold flex items-center gap-1.5 mb-1 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Errores encontrados en el archivo:
              </p>
              {errors.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5 pl-1">
                  <span>•</span> <span>{e}</span>
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                Vista Previa ({rows.length} productos detectados)
              </p>
              <div className="border border-border rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs">
                  <thead className="bg-muted/70 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="text-left p-2.5">Nombre</th>
                      <th className="text-left p-2.5">Categoría</th>
                      <th className="text-right p-2.5">Precio</th>
                      <th className="text-right p-2.5">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {rows.slice(0, 5).map((r, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="p-2.5 font-medium">{r.name || <span className="text-destructive">—</span>}</td>
                        <td className="p-2.5 text-muted-foreground">
                          {categories.find(c => c.id === r.category_id)?.name || '—'}
                        </td>
                        <td className="p-2.5 text-right font-medium">{formatPrice(r.price)}</td>
                        <td className="p-2.5 text-right text-muted-foreground">{r.stock}</td>
                      </tr>
                    ))}
                    {rows.length > 5 && (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-xs text-muted-foreground bg-muted/20 border-t border-border">
                          ... y {rows.length - 5} productos más en la lista.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-4 flex flex-row justify-end gap-3 flex-shrink-0">
          <Button variant="outline" type="button" onClick={handleClose}>Cancelar</Button>
          <Button
            type="button"
            disabled={!rows.length || bulkUpsert.isPending}
            onClick={handleImport}
            className="min-w-[120px]"
          >
            {bulkUpsert.isPending ? 'Importando...' : `Importar ${rows.length} Productos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

