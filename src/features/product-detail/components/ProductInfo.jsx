import { formatPrice } from '@/core/lib/utils'
import { StockBadge } from './StockBadge'

export function ProductInfo({ product }) {
  const { name, description, price, stock, specifications, categories } = product

  const specs = specifications && typeof specifications === 'object'
    ? Object.entries(specifications).filter(([, v]) => v)
    : []

  return (
    <div className="flex flex-col gap-4">
      {categories?.name && (
        <p className="text-sm text-muted-foreground">{categories.name}</p>
      )}
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold">{formatPrice(price)}</span>
        <StockBadge stock={stock} />
      </div>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
      )}
      {specs.length > 0 && (
        <div className="border rounded-lg divide-y">
          {specs.map(([key, value]) => (
            <div key={key} className="flex justify-between px-4 py-2 text-sm">
              <span className="text-muted-foreground capitalize">{key}</span>
              <span className="font-medium">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
