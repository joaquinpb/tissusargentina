import { formatPrice } from '@/core/lib/utils'
import { StockBadge } from './StockBadge'
import { useStoreSettings } from '@/core/hooks/queries/useSettingsQueries'
import { Banknote, CreditCard } from 'lucide-react'

export function ProductInfo({ product }) {
  const { name, description, price, stock, specifications, categories, discount_percentage } = product
  const { data: settings } = useStoreSettings()
  
  const hasDiscount = discount_percentage > 0
  const discountedPrice = hasDiscount ? price * (1 - discount_percentage / 100) : price

  const isPromoEligible = settings?.promo_active && discountedPrice >= settings.promo_min_amount
  const promoSavings = isPromoEligible ? discountedPrice * (settings.promo_discount_percentage / 100) : 0

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
      <div className="flex flex-col gap-2">
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
        
        {isPromoEligible && (
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-start gap-2 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400 p-3 rounded-lg border border-green-200 dark:border-green-900/50">
              <Banknote className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-snug">
                Ahorrás <strong className="font-semibold">{formatPrice(promoSavings)}</strong> con efectivo o transferencia
              </p>
            </div>
            
            <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
              <CreditCard className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-snug">
                Hasta <strong className="font-semibold">{settings.promo_installments} cuotas sin interés</strong> con tarjeta
              </p>
            </div>
          </div>
        )}
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
