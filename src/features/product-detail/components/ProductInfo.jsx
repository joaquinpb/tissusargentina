import { formatPrice } from '@/core/lib/utils'
import { StockBadge } from './StockBadge'

export function ProductInfo({ product }) {
  const { name, description, price, stock, specifications, categories, discount_percentage } = product
  
  const hasDiscount = discount_percentage > 0
  const discountedPrice = hasDiscount ? price * (1 - discount_percentage / 100) : price

  const specs = specifications && typeof specifications === 'object'
    ? Object.entries(specifications).filter(([, v]) => v)
    : []

  return (
    <div className="flex flex-col gap-4">
      {categories?.name && (
        <p className="text-sm text-muted-foreground">{categories.name}</p>
      )}
      <h1 className="text-2xl font-bold flex items-center gap-3">
        {name}
        {hasDiscount && (
          <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">-{discount_percentage}%</span>
        )}
      </h1>
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-3xl font-bold text-red-500">{formatPrice(discountedPrice)}</span>
              <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/60">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-3xl font-semibold">{formatPrice(price)}</span>
          )}
        </div>
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
