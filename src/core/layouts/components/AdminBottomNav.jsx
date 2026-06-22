import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, MessageSquare } from 'lucide-react'
import { APP_ROUTES } from '@/core/lib/routes'
import { cn } from '@/core/lib/utils'
import { useAdminRequests } from '@/core/hooks/queries/useContactRequestsQueries'

export function AdminBottomNav() {
  const { data: requests } = useAdminRequests()
  const hasPendingRequests = requests?.some((r) => r.status === 'pending')

  const navItems = [
    { to: APP_ROUTES.ADMIN.DASHBOARD(), label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: APP_ROUTES.ADMIN.PRODUCTS(), label: 'Productos', icon: Package },
    { to: APP_ROUTES.ADMIN.CATEGORIES(), label: 'Categorías', icon: Tag },
    { to: APP_ROUTES.ADMIN.REQUESTS(), label: 'Consultas', icon: MessageSquare },
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
          <div className="relative">
            <Icon className="h-5 w-5" />
            {label === 'Consultas' && hasPendingRequests && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
