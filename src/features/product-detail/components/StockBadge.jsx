import { Badge } from '@/core/components/ui/badge'

export function StockBadge({ stock }) {
  if (stock > 5) return <Badge variant="outline" className="text-green-700 border-green-300">En stock ({stock})</Badge>
  if (stock > 0) return <Badge variant="outline" className="text-amber-700 border-amber-300">Últimas unidades ({stock})</Badge>
  return <Badge variant="secondary">Sin stock</Badge>
}
