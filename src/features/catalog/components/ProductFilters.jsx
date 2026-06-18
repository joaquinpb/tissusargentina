import { Search } from 'lucide-react'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'

export function ProductFilters({ search, onSearchChange, inStockOnly, onInStockChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockChange(e.target.checked)}
          className="accent-primary"
        />
        Solo con stock
      </label>
    </div>
  )
}
