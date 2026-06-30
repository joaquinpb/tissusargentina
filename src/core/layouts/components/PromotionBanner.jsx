import { useStoreSettings } from '@/core/hooks/queries/useSettingsQueries'
import { formatPrice } from '@/core/lib/utils'

export function PromotionBanner() {
  const { data: settings, isLoading } = useStoreSettings()

  if (isLoading || !settings || !settings.promo_active) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground w-full py-2.5 px-4 flex items-center justify-center text-center relative z-[60] shadow-md overflow-hidden group">
      {/* Brillo sutil animado al pasar el mouse */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <p className="text-xs md:text-sm font-medium flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 relative z-10 drop-shadow-sm">
        <span className="text-primary-foreground/90">
          <strong className="font-bold text-primary-foreground text-sm md:text-base">{settings.promo_discount_percentage}% OFF</strong> efectivo o transferencia o <strong className="font-bold text-primary-foreground text-sm md:text-base">{settings.promo_installments} Cuotas</strong> sin interés
        </span>
        <span className="hidden md:inline opacity-50">|</span>
        <span className="opacity-90">
          En compras +{formatPrice(settings.promo_min_amount)}
        </span>
      </p>
    </div>
  )
}
