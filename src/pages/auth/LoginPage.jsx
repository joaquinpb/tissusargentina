import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { useAuth } from '@/core/context/AuthContext'
import { APP_ROUTES } from '@/core/lib/routes'
import { cn } from '@/core/lib/utils'

export default function LoginPage() {
  const { session } = useAuth()
  const [tab, setTab] = useState('login')

  if (session) return <Navigate to={APP_ROUTES.HOME()} replace />

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to={APP_ROUTES.HOME()} className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag className="h-6 w-6" />
            Tissus
          </Link>
          <p className="text-sm text-muted-foreground">
            {tab === 'login' ? 'Ingresá a tu cuenta' : 'Creá una cuenta nueva'}
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex border rounded-lg p-1 gap-1">
          {(['login', 'register']).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 text-sm py-1.5 rounded-md transition-colors',
                tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'login' ? 'Ingresar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}
