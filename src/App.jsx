import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PublicLayout } from './core/layouts/PublicLayout'
import { AdminLayout } from './core/layouts/AdminLayout'
import { useAuth } from './core/context/AuthContext'
import { APP_ROUTES } from './core/lib/routes'
import { useRealtimeSync } from './core/hooks/useRealtimeSync'

function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

// Páginas públicas
const HomePage = lazy(() => import('./pages/public/HomePage'))
const CatalogPage = lazy(() => import('./pages/public/CatalogPage'))
const PromotionsPage = lazy(() => import('./pages/public/PromotionsPage'))
const ProductPage = lazy(() => import('./pages/public/ProductPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))

// Cuenta
const AccountPage = lazy(() => import('./pages/account/AccountPage'))

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'))
const AdminRequestsPage = lazy(() => import('./pages/admin/AdminRequestsPage'))

function ProtectedRoute({ children }) {
  const { session, isAuthLoading } = useAuth()
  if (isAuthLoading) return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>
  if (!session) return <Navigate to={APP_ROUTES.LOGIN()} replace />
  return children
}

function AdminRoute({ children }) {
  const { session, isAdmin, isAuthLoading } = useAuth()
  if (isAuthLoading) return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>
  if (!session) return <Navigate to={APP_ROUTES.LOGIN()} replace />
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <p className="text-2xl font-bold">403</p>
      <p className="text-muted-foreground">No tenés acceso al panel de administración.</p>
    </div>
  )
  return children
}

const Loader = () => (
  <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">Cargando...</div>
)

export default function App() {
  useRealtimeSync()

  return (
    <Suspense fallback={<Loader />}>
      <ScrollToTop />
      <Routes>
        {/* Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/promociones" element={<PromotionsPage />} />
          <Route path="/productos/:slug" element={<ProductPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route
            path="/mi-cuenta"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<AdminProductsPage />} />
          <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
          <Route path="/admin/consultas" element={<AdminRequestsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
