"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Music, AlertCircle } from "lucide-react"

interface LoginModalProps {
  onClose: () => void
  onSwitchToRegister: () => void
  onLogin: () => void
}

export function LoginModal({ onClose, onSwitchToRegister, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      if (data.success && data.user) {
        // The cookie is set automatically by the API
        onLogin()
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error con cuenta demo")
        return
      }

      if (data.success && data.user) {
        onLogin()
      }
    } catch (err) {
      setError("Error al iniciar sesión con cuenta demo")
    } finally {
      setIsLoading(false)
    }
  }

  // Demo credentials for testing
  const DEMO_CREDENTIALS = {
    free: {
      email: "demo_free@auraradio.com",
      password: "demo123"
    },
    premium: {
      email: "demo_premium@auraradio.com", 
      password: "demo123"
    }
  }

  const ADMIN_CREDENTIALS = {
    email: "admin@auraradio.com",
    password: "admin123"
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-700 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-6 h-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Bienvenido de vuelta</CardTitle>
          <p className="text-gray-400">Inicia sesión en tu cuenta de AuraRadio</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Ingresa tu email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white pr-10"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-3">🎵 Cuentas Demo</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-blue-500/50 text-blue-300 hover:bg-blue-500/20 bg-transparent"
                onClick={() => handleDemoLogin(DEMO_CREDENTIALS.free.email, DEMO_CREDENTIALS.free.password)}
                disabled={isLoading}
              >
                Cuenta Gratuita: {DEMO_CREDENTIALS.free.email}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20 bg-transparent"
                onClick={() => handleDemoLogin(DEMO_CREDENTIALS.premium.email, DEMO_CREDENTIALS.premium.password)}
                disabled={isLoading}
              >
                Cuenta Premium: {DEMO_CREDENTIALS.premium.email}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-red-500/50 text-red-300 hover:bg-red-500/20 bg-transparent"
                onClick={() => handleDemoLogin(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)}
                disabled={isLoading}
              >
                Admin: {ADMIN_CREDENTIALS.email}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button variant="link" className="text-green-400 hover:text-green-300">
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          <Separator className="bg-gray-700" />

          <div className="text-center">
            <p className="text-gray-400 mb-4">¿No tienes una cuenta?</p>
            <Button
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              onClick={onSwitchToRegister}
            >
              Crear Cuenta
            </Button>
          </div>

          <Button variant="ghost" className="w-full text-gray-400 hover:text-white" onClick={onClose}>
            Continuar como invitado
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
