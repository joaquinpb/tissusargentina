import { useAdminRequests } from '@/core/hooks/queries/useContactRequestsQueries'
import { RequestsTable } from '@/features/admin-requests/components/RequestsTable'

export default function AdminRequestsPage() {
  const { data: requests, isLoading } = useAdminRequests()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Consultas</h1>
        <p className="text-muted-foreground text-sm">{requests?.length ?? 0} consultas en total</p>
      </div>
      <RequestsTable requests={requests} isLoading={isLoading} />
    </div>
  )
}
