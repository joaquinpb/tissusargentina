import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/core/lib/routes'
import { MapPin, Phone } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <Link to={APP_ROUTES.HOME()} className="flex items-center gap-2">
            <img src="/logo-compacto.png" alt="Tissus" className="h-7 w-auto object-contain dark:invert" />
            <span className="font-bold text-lg">Tissus</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Mesas de pool, ping pong y accesorios</p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+54 9 11 2258-8537 (Celular)</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+54 11 4585-7802 (Local)</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Av. San Martin 3280, CABA</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link to={APP_ROUTES.CATALOG()} className="hover:text-foreground transition-colors">Productos</Link>
            <Link to={APP_ROUTES.CONTACT()} className="hover:text-foreground transition-colors">Contacto</Link>
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Tissus. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
