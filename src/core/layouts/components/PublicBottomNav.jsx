import { NavLink } from 'react-router-dom'
import { Home, Grid, MessageSquare, User } from 'lucide-react'
import { APP_ROUTES } from '@/core/lib/routes'
import { useAuth } from '@/core/context/AuthContext'
import { cn } from '@/core/lib/utils'

export function PublicBottomNav() {
  const { session } = useAuth()

  const navItems = [
    { to: APP_ROUTES.HOME(), label: 'Inicio', icon: Home, exact: true },
    { to: APP_ROUTES.CATALOG(), label: 'Productos', icon: Grid },
    { to: APP_ROUTES.CONTACT(), label: 'Contacto', icon: MessageSquare },
    { to: session ? APP_ROUTES.ACCOUNT() : APP_ROUTES.LOGIN(), label: session ? 'Cuenta' : 'Ingresar', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/95 border-t flex items-center justify-around pb-safe md:hidden backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map(({ to, label, icon: Icon, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 w-16 h-full text-xs transition-colors',
              isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
