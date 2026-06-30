import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/core/components/ui/card'
import { Badge } from '@/core/components/ui/badge'
import { APP_ROUTES } from '@/core/lib/routes'
import { formatPrice } from '@/core/lib/utils'

export function ProductCard({ product }) {
  const { name, slug, price, stock, images, categories, discount_percentage } = product
  const image = images?.[0]
  const hasDiscount = discount_percentage > 0
  const discountedPrice = hasDiscount ? price * (1 - discount_percentage / 100) : price

  return (
    <Link to={APP_ROUTES.PRODUCT(slug)}>
      <Card className="group overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="aspect-square overflow-hidden bg-muted relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary">Sin stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 flex flex-col gap-1 flex-1 relative">
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 border-none shadow-sm z-10 font-bold px-2 py-0.5">-{discount_percentage}%</Badge>
          )}
          {categories?.name && (
            <p className="text-xs text-muted-foreground">{categories.name}</p>
          )}
          <p className="font-medium text-sm leading-tight line-clamp-2">{name}</p>
          <div className="mt-auto pt-1 flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <p className="text-sm font-bold text-red-500">{formatPrice(discountedPrice)}</p>
                  <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/60">{formatPrice(price)}</p>
                </>
              ) : (
                <p className="text-sm font-semibold">{formatPrice(price)}</p>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground/80 italic leading-tight">
              * Precio sin impuestos nacionales: {formatPrice(discountedPrice / 1.21)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
