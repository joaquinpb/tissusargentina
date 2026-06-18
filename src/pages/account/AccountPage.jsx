import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Badge } from '@/core/components/ui/badge'
import { Skeleton } from '@/core/components/ui/skeleton'
import { useAuth } from '@/core/context/AuthContext'
import { useUserRequests } from '@/core/hooks/queries/useContactRequestsQueries'
import { updateProfile } from '@/core/services/api'
import { RequestStatusBadge } from '@/features/admin-requests/components/RequestStatusBadge'
import { formatDate } from '@/core/lib/utils'
import { cn } from '@/core/lib/utils'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Ingresá tu nombre'),
  phone: z.string().optional(),
})

export default function AccountPage() {
  const { session, userProfile, fetchProfile } = useAuth()
  const [tab, setTab] = useState('perfil')

  const { data: requests, isLoading: requestsLoading } = useUserRequests(session?.user?.id)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: userProfile?.full_name || '',
      phone: userProfile?.phone || '',
    },
  })

  const onSaveProfile = async (values) => {
    try {
      await updateProfile(session.user.id, values)
      await fetchProfile(session.user.id)
      toast.success('Perfil actualizado')
    } catch {
      toast.error('Error al actualizar el perfil')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Mi cuenta</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {['perfil', 'consultas'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm -mb-px border-b-2 transition-colors capitalize',
              tab === t ? 'border-primary font-medium' : 'border-transparent text-muted-foreground'
            )}
          >
            {t === 'consultas' ? `Mis consultas${requests?.length ? ` (${requests.length})` : ''}` : 'Perfil'}
          </button>
        ))}
      </div>

      {tab === 'perfil' && (
        <form onSubmit={handleSubmit(onSaveProfile)} className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre completo</Label>
            <Input {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input value={session?.user?.email || ''} disabled className="opacity-60" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Teléfono / WhatsApp</Label>
            <Input {...register('phone')} placeholder="+54 9 11 ..." />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      )}

      {tab === 'consultas' && (
        <div>
          {requestsLoading ? (
            <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : !requests?.length ? (
            <p className="text-muted-foreground text-sm">No tenés consultas enviadas todavía.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 text-sm flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{r.products?.name || 'Consulta general'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                    </div>
                    <RequestStatusBadge status={r.status} />
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{r.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
