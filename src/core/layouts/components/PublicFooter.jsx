import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/core/lib/routes'

export function PublicFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Link to={APP_ROUTES.HOME()} className="flex items-center gap-2">
            <img src="/logo-compacto.png" alt="Tissus" className="h-7 w-auto object-contain dark:invert" />
            <span className="font-bold text-lg">Tissus</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Mesas de pool, ping pong y accesorios</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to={APP_ROUTES.CATALOG()} className="hover:text-foreground transition-colors">Catálogo</Link>
          <Link to={APP_ROUTES.CONTACT()} className="hover:text-foreground transition-colors">Contacto</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Tissus. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
