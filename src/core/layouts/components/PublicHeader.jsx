import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, LogOut, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/core/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu'
import { useAuth } from '@/core/context/AuthContext'
import { APP_ROUTES } from '@/core/lib/routes'
import { cn } from '@/core/lib/utils'

const NAV_LINKS = [
  { to: APP_ROUTES.HOME(), label: 'Inicio', exact: true },
  { to: APP_ROUTES.CATALOG(), label: 'Catálogo' },
  { to: APP_ROUTES.CONTACT(), label: 'Contacto' },
]

export function PublicHeader() {
  const { session, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate(APP_ROUTES.HOME())
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to={APP_ROUTES.HOME()} className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <ShoppingBag className="h-5 w-5" />
          Tissus
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn('transition-colors hover:text-foreground', isActive ? 'text-foreground font-medium' : 'text-muted-foreground')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(APP_ROUTES.ACCOUNT())}>
                  <User className="mr-2 h-4 w-4" /> Mi cuenta
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(APP_ROUTES.ADMIN.DASHBOARD())}>
                      <Settings className="mr-2 h-4 w-4" /> Panel admin
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate(APP_ROUTES.LOGIN())}>
              Ingresar
            </Button>
          )}

          {/* Hamburguesa móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Nav móvil */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm bg-background">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn('transition-colors', isActive ? 'text-foreground font-medium' : 'text-muted-foreground')
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
