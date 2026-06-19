import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { 
  MessageCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Package, 
  ClipboardList, 
  FileText,
  AlertCircle
} from 'lucide-react'
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
      toast.success('Consulta actualizada con éxito')
      onClose()
    } catch {
      toast.error('Error al actualizar la consulta')
    }
  }

  const waLink = request?.phone
    ? `https://wa.me/${request.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${request.name}, te contactamos por tu consulta sobre ${request.products?.name || 'nuestros productos'}.`)}`
    : null

  if (!request) return null

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl h-full flex flex-col p-0 gap-0 overflow-hidden">
        <SheetHeader className="px-6 py-5 border-b border-border flex-shrink-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalle de Consulta
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Revisa los datos del cliente, la consulta realizada y gestiona el estado del seguimiento.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* SECCIÓN 1: DATOS DEL CLIENTE */}
          <div className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground/75" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Datos del Cliente</h3>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-muted-foreground/60" />
                <span className="font-semibold text-foreground">{request.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground/60" />
                <a href={`mailto:${request.email}`} className="text-muted-foreground hover:text-primary transition-colors hover:underline">
                  {request.email}
                </a>
              </div>
              {request.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-muted-foreground font-mono">{request.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 pt-1 text-xs text-muted-foreground border-t border-border/50">
                <Calendar className="h-3.5 w-3.5" />
                <span>Recibido: {formatDate(request.created_at)}</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PRODUCTO CONSULTADO */}
          {request.products && (
            <div className="space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Package className="h-4 w-4 text-muted-foreground/75" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto Consultado</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center flex-shrink-0">
                  {request.products.images && request.products.images[0] ? (
                    <img 
                      src={request.products.images[0]} 
                      alt="" 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground/70" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{request.products.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Código de Referencia
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 3: MENSAJE */}
          <div className="space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <MessageSquare className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mensaje de Consulta</h3>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 dark:bg-muted/15 border border-border text-sm leading-relaxed text-foreground whitespace-pre-line font-sans italic">
              "{request.message}"
            </div>
          </div>

          {/* SECCIÓN 4: ACCIÓN WHATSAPP */}
          {waLink && (
            <div className="p-1">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button 
                  type="button"
                  className="w-full h-11 bg-[#25D366] text-white hover:bg-[#20ba5a] active:bg-[#1da850] shadow-sm font-semibold rounded-xl gap-2 border-none transition-all duration-200 hover:scale-[1.01]"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  Contactar por WhatsApp
                </Button>
              </a>
            </div>
          )}

          {/* SECCIÓN 5: GESTIÓN INTERNA */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <ClipboardList className="h-4 w-4 text-muted-foreground/75" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gestión y Seguimiento</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-medium text-sm">Estado de la Consulta</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v)}>
                <SelectTrigger className="w-full focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="font-medium text-sm">Notas Internas</Label>
              <Textarea 
                {...register('admin_notes')} 
                rows={4} 
                placeholder="Escribe comentarios de seguimiento o anotaciones internas. Solo visibles para administradores..." 
                className="focus-visible:ring-primary resize-y min-h-[100px]"
              />
            </div>
          </form>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border bg-muted/20 dark:bg-muted/10 flex-shrink-0 flex-row justify-end gap-3 mt-0">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cerrar
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)} className="min-w-[120px]">
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

