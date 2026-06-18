import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { CategoriesTable } from '@/features/admin-categories/components/CategoriesTable'
import { CategoryFormSheet } from '@/features/admin-categories/components/CategoryFormSheet'
import { useAdminCategories } from '@/core/hooks/queries/useCategoriesQueries'

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories()
  const [editCategory, setEditCategory] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleEdit = (category) => {
    setEditCategory(category)
    setSheetOpen(true)
  }

  const handleNew = () => {
    setEditCategory(null)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-muted-foreground text-sm">{categories?.length ?? 0} categorías</p>
        </div>
        <Button size="sm" onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" /> Nueva categoría
        </Button>
      </div>

      <CategoriesTable categories={categories} isLoading={isLoading} onEdit={handleEdit} />

      <CategoryFormSheet
        category={editCategory}
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditCategory(null) }}
      />
    </div>
  )
}
