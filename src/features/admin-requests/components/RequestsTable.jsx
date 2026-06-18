import { useState } from 'react'
import { Skeleton } from '@/core/components/ui/skeleton'
import { Button } from '@/core/components/ui/button'
import { RequestStatusBadge } from './RequestStatusBadge'
import { RequestDetailSheet } from './RequestDetailSheet'
import { formatDate } from '@/core/lib/utils'
import { cn } from '@/core/lib/utils'

const TABS = [
  { value: undefined, label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'contacted', label: 'Contactadas' },
  { value: 'closed', label: 'Cerradas' },
]

export function RequestsTable({ requests, isLoading, onStatusChange }) {
  const [activeTab, setActiveTab] = useState(undefined)
  const [selected, setSelected] = useState(null)

  const filtered = activeTab ? requests?.filter((r) => r.status === activeTab) : requests

  if (isLoading) {
    return <div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 border-b mb-4">
        {TABS.map((t) => (
          <button
            key={String(t.value)}
            onClick={() => setActiveTab(t.value)}
            className={cn(
              'px-3 py-2 text-sm -mb-px border-b-2 transition-colors',
              activeTab === t.value
                ? 'border-primary text-foreground font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!filtered?.length ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No hay consultas en esta categoría.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs">
              <tr>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3 hidden md:table-cell">Producto</th>
                <th className="text-left p-3 hidden sm:table-cell">Fecha</th>
                <th className="text-center p-3">Estado</th>
                <th className="text-right p-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">
                    {r.products?.name || 'Consulta general'}
                  </td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="p-3 text-center">
                    <RequestStatusBadge status={r.status} />
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RequestDetailSheet
        request={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
