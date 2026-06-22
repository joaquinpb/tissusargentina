import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Textarea } from '@/core/components/ui/textarea'
import { useContactMutations } from '@/core/hooks/queries/useContactRequestsQueries'
import { useAuth } from '@/core/context/AuthContext'

const schema = z.object({
  name: z.string().min(2, 'Ingresá tu nombre'),
  email: z.union([z.literal(''), z.string().email('Email inválido')]),
  phone: z.string().min(8, 'Ingresá un teléfono válido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export function ContactForm({ product }) {
  const { session, userProfile } = useAuth()
  const { submit } = useContactMutations()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userProfile?.full_name || '',
      email: session?.user?.email || '',
      message: product ? `Hola, me interesa el producto "${product.name}". ` : '',
    },
  })

  const onSubmit = async (values) => {
    try {
      await submit.mutateAsync({
        ...values,
        product_id: product?.id || null,
        user_id: session?.user?.id || null,
      })
      toast.success('¡Consulta enviada! Nos pondremos en contacto a la brevedad.')
      reset()
    } catch {
      toast.error('Error al enviar la consulta. Intentá de nuevo.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" {...register('name')} placeholder="Tu nombre" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} placeholder="tu@email.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
        <Input id="phone" type="tel" {...register('phone')} placeholder="+54 9 11 ..." />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea id="message" {...register('message')} rows={4} placeholder="Contanos qué necesitás..." />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  )
}
