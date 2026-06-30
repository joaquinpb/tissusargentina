import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/core/components/ui/sonner'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminBottomNav } from './components/AdminBottomNav'

export function AdminLayout() {
  const Loader = () => (
    <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
      Cargando...
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden relative">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <main className="p-6">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <AdminBottomNav />
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
