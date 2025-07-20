"use client"

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { User, Settings, LogOut, Crown, Sparkles } from 'lucide-react'

export function UserAccountNav() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-700 animate-pulse rounded-full"></div>
    )
  }

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleIcon = () => {
    if (user.role === 'admin') {
      return <Crown className="w-3 h-3 text-yellow-500" />
    }
    if (user.subscription_plan === 'premium' || user.subscription_plan === 'family') {
      return <Sparkles className="w-3 h-3 text-purple-500" />
    }
    return null
  }

  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-300">Admin</Badge>
    }
    if (user.subscription_plan === 'premium') {
      return <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">Premium</Badge>
    }
    if (user.subscription_plan === 'family') {
      return <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">Family</Badge>
    }
    return <Badge variant="outline" className="text-xs">Free</Badge>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-600 text-white">
              {getInitials(user.full_name || user.email)}
            </AvatarFallback>
          </Avatar>
          {getRoleIcon() && (
            <div className="absolute -top-1 -right-1">
              {getRoleIcon()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {user.full_name || 'Usuario'}
              </p>
              {getRoleBadge()}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.play_count > 0 && (
              <p className="text-xs text-green-400">
                🎵 {user.play_count} reproducciones
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        {(user.subscription_plan === 'basic' || user.subscription_status !== 'active') && (
          <DropdownMenuItem className="text-purple-400">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Actualizar a Premium</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
