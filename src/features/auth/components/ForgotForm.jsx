import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { supabase } from '@/core/services/supabase'
import { ArrowLeft, Loader2, MailCheck, AlertCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export function ForgotForm({ onBackToLogin }) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }) => {
    setErrorMsg('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?tab=reset-password`,
      })
      if (error) {
        setErrorMsg(error.message || 'Ocurrió un error al enviar el correo.')
        toast.error('No se pudo enviar el correo de recuperación.')
        return
      }
      setIsSuccess(true)
      toast.success('Correo de recuperación enviado.')
    } catch (err) {
      setErrorMsg('Error de red o conexión.')
      toast.error('Error de red.')
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Revisá tu correo</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Te enviamos un enlace a tu correo para que puedas restablecer tu contraseña.
            No olvides revisar la carpeta de correo no deseado o spam.
          </p>
        </div>
        <Button onClick={onBackToLogin} variant="outline" className="w-full mt-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a ingresar
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ingresá tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive dark:bg-destructive/20 border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          placeholder="tu@email.com"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando instrucciones...
          </>
        ) : (
          'Enviar instrucciones'
        )}
      </Button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors py-2 mt-1 gap-1"
      >
        <ArrowLeft className="h-3 w-3" />
        Volver a ingresar
      </button>
    </form>
  )
}
