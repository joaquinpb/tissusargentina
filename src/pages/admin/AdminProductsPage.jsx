import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { ProductsTable } from '@/features/admin-products/components/ProductsTable'
import { ProductFormSheet } from '@/features/admin-products/components/ProductFormSheet'
import { CsvImportDialog } from '@/features/admin-products/components/CsvImportDialog'
import { useAdminProducts } from '@/core/hooks/queries/useProductsQueries'

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts()
  const [editProduct, setEditProduct] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = search
    ? products?.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  const handleEdit = (product) => {
    setEditProduct(product)
    setSheetOpen(true)
  }

  const handleNew = () => {
    setEditProduct(null)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground text-sm">{products?.length ?? 0} en total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCsvOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Importar CSV
          </Button>
          <Button size="sm" onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo producto
          </Button>
        </div>
      </div>

      <Input
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <ProductsTable products={filtered} isLoading={isLoading} onEdit={handleEdit} />

      <ProductFormSheet
        product={editProduct}
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditProduct(null) }}
      />

      <CsvImportDialog open={csvOpen} onClose={() => setCsvOpen(false)} />
    </div>
  )
}
