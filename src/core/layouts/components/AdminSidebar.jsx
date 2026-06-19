import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, MessageSquare, LogOut } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Separator } from '@/core/components/ui/separator'
import { useAuth } from '@/core/context/AuthContext'
import { APP_ROUTES } from '@/core/lib/routes'
import { cn } from '@/core/lib/utils'

const NAV_ITEMS = [
  { to: APP_ROUTES.ADMIN.DASHBOARD(), label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: APP_ROUTES.ADMIN.PRODUCTS(), label: 'Productos', icon: Package },
  { to: APP_ROUTES.ADMIN.CATEGORIES(), label: 'Categorías', icon: Tag },
  { to: APP_ROUTES.ADMIN.REQUESTS(), label: 'Consultas', icon: MessageSquare },
]

export function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(APP_ROUTES.HOME())
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center px-4 border-b">
        <Link to={APP_ROUTES.HOME()} className="flex items-center gap-2">
          <img src="/logo-compacto.png" alt="Tissus" className="h-6 w-auto object-contain dark:invert" />
          <span className="font-bold text-base tracking-tight text-sidebar-foreground">Tissus Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-4 border-t">
        <Separator className="mb-4" />
        <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
