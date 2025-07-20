"use client"

import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  requirePremium?: boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  requirePremium = false,
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Necesitas iniciar sesión para acceder a esta página</p>
          <a 
            href="/auth/login" 
            className="text-green-500 hover:text-green-400 underline"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    )
  }

  if (requireAdmin && user?.role !== 'admin') {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    )
  }

  if (requirePremium && !(['premium', 'family'].includes(user?.subscription_plan || ''))) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Necesitas una suscripción Premium para acceder a esta función</p>
          <a 
            href="/subscription" 
            className="text-purple-500 hover:text-purple-400 underline"
          >
            Ver planes Premium
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Loading component for auth states
export function AuthLoading() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-green-500" />
        <p className="text-sm text-gray-400">Verificando sesión...</p>
      </div>
    </div>
  )
}
