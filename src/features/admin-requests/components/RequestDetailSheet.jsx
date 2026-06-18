import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/core/components/ui/sheet'
import { Button } from '@/core/components/ui/button'
import { Label } from '@/core/components/ui/label'
import { Textarea } from '@/core/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/core/components/ui/select'
import { useContactMutations } from '@/core/hooks/queries/useContactRequestsQueries'
import { REQUEST_STATUS_OPTIONS } from '@/core/lib/constants'
import { RequestStatusBadge } from './RequestStatusBadge'
import { formatDate } from '@/core/lib/utils'

export function RequestDetailSheet({ request, open, onClose }) {
  const { update } = useContactMutations()
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      status: request?.status || 'pending',
      admin_notes: request?.admin_notes || '',
    },
  })

  const onSubmit = async (values) => {
    try {
      await update.mutateAsync({ id: request.id, ...values })
      toast.success('Consulta actualizada')
      onClose()
    } catch {
      toast.error('Error al actualizar')
    }
  }

  const waLink = request?.phone
    ? `https://wa.me/${request.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${request.name}, te contactamos por tu consulta sobre ${request.products?.name || 'nuestros productos'}.`)}`
    : null

  if (!request) return null

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Consulta de {request.name}</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-4">
          {/* Info del cliente */}
          <div className="bg-muted rounded-lg p-4 text-sm flex flex-col gap-1.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{request.name}</p>
                <p className="text-muted-foreground">{request.email}</p>
                {request.phone && <p className="text-muted-foreground">{request.phone}</p>}
              </div>
              <RequestStatusBadge status={request.status} />
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(request.created_at)}</p>
          </div>

          {/* Producto */}
          {request.products && (
            <div className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">Producto consultado</p>
              <p className="font-medium">{request.products.name}</p>
            </div>
          )}

          {/* Mensaje */}
          <div className="text-sm">
            <p className="text-muted-foreground text-xs mb-0.5">Mensaje</p>
            <p className="whitespace-pre-line">{request.message}</p>
          </div>

          {/* WhatsApp */}
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
              </Button>
            </a>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Estado</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Notas internas</Label>
              <Textarea {...register('admin_notes')} rows={4} placeholder="Solo visibles para vos..." />
            </div>
            <SheetFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cerrar</Button>
              <Button type="submit" disabled={isSubmitting}>Guardar</Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
