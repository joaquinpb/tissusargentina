import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { ProductCarousel } from '@/features/catalog/components/ProductCarousel'
import { useFeaturedProducts } from '@/core/hooks/queries/useProductsQueries'
import { APP_ROUTES } from '@/core/lib/routes'

const WHATSAPP_NUMBER = '5491122588537'

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function HomePage() {
  const { data: featured, isLoading } = useFeaturedProducts()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-4xl">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Tissus Argentina"
              className="h-24 md:h-36 w-auto object-contain dark:invert animate-in fade-in slide-in-from-left-4 duration-1000"
            />
          </div>
          
          {/* Content on the right */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Mesas de pool, ping pong y accesorios
            </h1>
            <p className="text-lg text-muted-foreground">
              La mejor calidad para tu hogar, club o negocio. Consultanos sin compromiso.
            </p>
            
            {/* Buttons below the text */}
            <div className="flex gap-3 flex-wrap mt-2 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link to={APP_ROUTES.CATALOG()}>
                  Ver productos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero consultar sobre sus productos.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="mr-2 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      {(isLoading || featured?.length > 0) && (
        <section className="container mx-auto px-4 py-12 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Productos destacados</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to={APP_ROUTES.CATALOG()}>Ver todos <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <ProductCarousel products={featured} isLoading={isLoading} />
        </section>
      )}

      {/* CTA final */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center gap-4">
          <img
            src="/logo-compacto.png"
            alt="Tissus"
            className="h-10 w-auto object-contain opacity-50 dark:invert mb-1"
          />
          <h2 className="text-2xl font-bold">¿Tenés alguna duda?</h2>
          <p className="text-muted-foreground">Contactanos y te asesoramos sin compromiso.</p>
          <Button asChild>
            <Link to={APP_ROUTES.CONTACT()}>Escribinos</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
