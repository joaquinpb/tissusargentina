import { Outlet } from 'react-router-dom'
import { Toaster } from '@/core/components/ui/sonner'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminBottomNav } from './components/AdminBottomNav'

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <AdminBottomNav />
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
