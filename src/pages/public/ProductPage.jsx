import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Skeleton } from '@/core/components/ui/skeleton'
import { ProductGallery } from '@/features/product-detail/components/ProductGallery'
import { ProductInfo } from '@/features/product-detail/components/ProductInfo'
import { ContactForm } from '@/features/product-detail/components/ContactForm'
import { useProductBySlug } from '@/core/hooks/queries/useProductsQueries'
import { APP_ROUTES } from '@/core/lib/routes'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isSuccess } = useProductBySlug(slug)

  useEffect(() => {
    if (isSuccess && !product) navigate(APP_ROUTES.CATALOG(), { replace: true })
  }, [isSuccess, product])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link to={APP_ROUTES.CATALOG()}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Volver al catálogo
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />
          <div>
            <h2 className="text-lg font-semibold mb-4">Consultá por este producto</h2>
            <ContactForm product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
