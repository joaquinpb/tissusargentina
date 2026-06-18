import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/core/components/ui/card'
import { Badge } from '@/core/components/ui/badge'
import { APP_ROUTES } from '@/core/lib/routes'
import { formatPrice } from '@/core/lib/utils'

export function ProductCard({ product }) {
  const { name, slug, price, stock, images, categories } = product
  const image = images?.[0]

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
        <CardContent className="p-3 flex flex-col gap-1 flex-1">
          {categories?.name && (
            <p className="text-xs text-muted-foreground">{categories.name}</p>
          )}
          <p className="font-medium text-sm leading-tight line-clamp-2">{name}</p>
          <p className="text-sm font-semibold mt-auto pt-1">{formatPrice(price)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
