import { Outlet } from 'react-router-dom'
import { Toaster } from '@/core/components/ui/sonner'
import { AdminSidebar } from './components/AdminSidebar'

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
