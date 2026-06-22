import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { ProductsTable } from '@/features/admin-products/components/ProductsTable'
import { ProductFormSheet } from '@/features/admin-products/components/ProductFormSheet'
import { CsvImportDialog } from '@/features/admin-products/components/CsvImportDialog'
import { useAdminProducts } from '@/core/hooks/queries/useProductsQueries'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select'
import { useMemo } from 'react'

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts()
  const [editProduct, setEditProduct] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name_asc')

  const filtered = useMemo(() => {
    let result = products ? [...products] : []
    if (search) {
      result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    result.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      return 0
    })
    return result
  }, [products, search, sortBy])

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

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Alfabético (A-Z)</SelectItem>
              <SelectItem value="price_asc">Precio: Menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: Mayor a menor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
