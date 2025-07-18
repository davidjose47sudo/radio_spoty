"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Music } from "lucide-react"

interface LoginModalProps {
  onClose: () => void
  onSwitchToRegister: () => void
  onLogin: (email: string, password: string) => void
}

export function LoginModal({ onClose, onSwitchToRegister, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    onLogin(email, password)
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-6 h-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <p className="text-gray-400">Sign in to your AuraRadio account</p>
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
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white pr-10"
                  placeholder="Enter your password"
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

            {/* Demo Accounts Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <h4 className="text-blue-300 font-medium mb-2">🎵 Demo Accounts</h4>
              <div className="space-y-2 text-sm">
                <div className="text-blue-200">
                  <strong>Free Account:</strong>
                  <br />
                  Email: test@example.com
                  <br />
                  Password: password123
                </div>
                <div className="text-blue-200">
                  <strong>Premium Account:</strong>
                  <br />
                  Email: premium@example.com
                  <br />
                  Password: premium123
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" className="text-green-400 hover:text-green-300">
              Forgot password?
            </Button>
          </div>

          <Separator className="bg-gray-700" />

          <div className="text-center">
            <p className="text-gray-400 mb-4">Don't have an account?</p>
            <Button
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              onClick={onSwitchToRegister}
            >
              Sign Up
            </Button>
          </div>

          <Button variant="ghost" className="w-full text-gray-400 hover:text-white" onClick={onClose}>
            Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
