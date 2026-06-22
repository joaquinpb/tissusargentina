import { Search } from 'lucide-react'
import { Input } from '@/core/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select'

export function ProductFilters({ search, onSearchChange, inStockOnly, onInStockChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1 w-full sm:w-auto">
        <div className="relative flex-1 max-w-xs w-full">
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

      <div className="w-full sm:w-48">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
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
  )
}
