import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { supabase } from '@/core/services/supabase'
import { APP_ROUTES } from '@/core/lib/routes'
import { Eye, EyeOff, Loader2, MailCheck, AlertCircle, ArrowLeft } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Ingresá tu nombre completo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export function RegisterForm({ onSwitchToLogin }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ full_name, email, password }) => {
    setErrorMsg('')
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      
      if (error) {
        let msg = error.message || 'Ocurrió un error al registrarse.'
        if (error.message.includes('User already registered')) {
          msg = 'Este correo electrónico ya está registrado.'
        }
        setErrorMsg(msg)
        toast.error(msg)
        return
      }

      setRegisteredEmail(email)
      
      // If session is active right away, it means auto-confirm is enabled
      if (data?.session) {
        toast.success('¡Registro exitoso! Iniciando sesión...')
        navigate(APP_ROUTES.HOME())
      } else {
        setIsSuccess(true)
        toast.success('¡Cuenta creada! Revisa tu email.')
      }
    } catch (err) {
      setErrorMsg('Error de red o conexión al servidor.')
      toast.error('Error de conexión.')
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Verificá tu casilla de correo</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Te enviamos un correo de confirmación a <span className="font-medium text-foreground">{registeredEmail}</span>.
            Hacé clic en el enlace para activar tu cuenta antes de iniciar sesión.
          </p>
        </div>
        <Button onClick={onSwitchToLogin} variant="outline" className="w-full mt-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ir al inicio de sesión
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-in fade-in duration-300">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive dark:bg-destructive/25 border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input
          id="full_name"
          autoComplete="name"
          {...register('full_name')}
          placeholder="Juan Pérez"
          disabled={isSubmitting}
        />
        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          placeholder="tu@email.com"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative flex items-center">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('password')}
            placeholder="••••••"
            disabled={isSubmitting}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={isSubmitting}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </Button>
    </form>
  )
}
