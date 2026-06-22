import { useActiveProducts } from '@/core/hooks/queries/useProductsQueries'
import { useCategories } from '@/core/hooks/queries/useCategoriesQueries'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { ProductFilters } from '@/features/catalog/components/ProductFilters'
import { CategoryNav } from '@/features/catalog/components/CategoryNav'
import { useCatalogFilters } from '@/features/catalog/hooks/useCatalogFilters'

export default function CatalogPage() {
  const { data: products = [], isLoading } = useActiveProducts()
  const { data: categories = [] } = useCategories()

  const {
    search, setSearch,
    selectedCategory, setCategory,
    inStockOnly, setInStockOnly,
    sortBy, setSortBy,
    filtered,
  } = useCatalogFilters(products)

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Catálogo</h1>
        <p className="text-muted-foreground text-sm">{filtered.length} productos encontrados</p>
      </div>

      <CategoryNav
        categories={categories}
        selectedSlug={selectedCategory}
        onSelect={setCategory}
      />

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ProductGrid products={filtered} isLoading={isLoading} />
    </div>
  )
}
