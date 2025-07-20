"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
  MoreHorizontal,
  Radio,
  Shuffle,
  Repeat,
  Settings,
  User,
  Search,
  Library,
  Plus,
  ChevronLeft,
  ChevronRight,
  Crown,
  Music,
  TrendingUp,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react"

// Import components
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"
import { MusicPreferences } from "@/components/onboarding/music-preferences"
import { ProfilePage } from "@/components/profile/profile-page"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { TrendsPage } from "@/components/trends/trends-page"
import { SearchPage } from "@/components/search/search-page"
import { JamsPage } from "@/components/jams/jams-page"
import { FriendsManager } from "@/components/friends/friends-manager"
import { SettingsPage } from "@/components/settings/settings-page"
import VoiceControlModal from "@/components/voice/voice-control-modal"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { FloatingControlPanel } from "@/components/floating-control-panel"

// Import hooks and utilities
import { useMusicAPI } from "@/components/music-api"
import { AIInsights } from "@/components/ai-features"
import { useAuth } from "@/hooks/use-auth"

export default function AuraRadio() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentView, setCurrentView] = useState("home")
  const [showVoiceControl, setShowVoiceControl] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [rightPanelMode, setRightPanelMode] = useState<"full" | "compact" | "hidden">("full")

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<any>(null)
  const [currentStation, setCurrentStation] = useState<any>(null)
  const [volume, setVolume] = useState(75)
  const [progress, setProgress] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off")

  // Use music API hook
  const {
    stations,
    playlists,
    currentTrack,
    isLoading: musicLoading,
    user: musicUser,
    hasEnoughPlays,
    playTrack,
  } = useMusicAPI()

  useEffect(() => {
    // Check if user needs onboarding
    if (user && !user.full_name) {
      setShowOnboarding(true)
    }
  }, [user])

  const handleLogin = () => {
    setShowLogin(false)
  }

  const handleRegister = () => {
    setShowRegister(false)
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  const handlePlayTrack = async (track: any) => {
    await playTrack(track)
    setCurrentSong(track)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    // Implementation for next track
  }

  const previousTrack = () => {
    // Implementation for previous track
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Music className="w-8 h-8 text-black" />
          </div>
          <div className="text-white text-xl font-semibold mb-2">Cargando AuraRadio...</div>
          <div className="text-gray-400">Preparando tu experiencia musical</div>
        </div>
      </div>
    )
  }

  // Render different views based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "profile":
        return (
          <ProfilePage
            user={user}
            onClose={() => setCurrentView("home")}
            onLogout={() => {
              logout()
              setCurrentView("home")
            }}
          />
        )
      case "subscription":
        return <SubscriptionPlans onClose={() => setCurrentView("home")} />
      case "trends":
        return (
          <TrendsPage
            onClose={() => setCurrentView("home")}
            onStationSelect={(stationId) => setCurrentView("station")}
            onJamSelect={(jamId) => setCurrentView("jams")}
          />
        )
      case "search":
        return (
          <SearchPage
            onClose={() => setCurrentView("home")}
            onArtistSelect={(artistId) => setCurrentView("artist")}
            onStationSelect={(stationId) => setCurrentView("station")}
            onJamSelect={(jamId) => setCurrentView("jams")}
          />
        )
      case "jams":
        return <JamsPage onClose={() => setCurrentView("home")} />
      case "friends":
        return <FriendsManager user={user} onClose={() => setCurrentView("home")} />
      case "settings":
        return (
          <SettingsPage
            user={user}
            onClose={() => setCurrentView("home")}
            onUpdateSettings={() => {}}
            isAuraEnabled={true}
            onToggleAura={() => {}}
          />
        )
      default:
        return renderHomeView()
    }
  }

  const renderHomeView = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 bg-gray-900/80 backdrop-blur-md p-4 flex items-center justify-between z-10 border-b border-gray-800/50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="w-8 h-8 bg-black/40 text-gray-400 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 bg-black/40 text-gray-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar canciones, artistas..."
              className="pl-10 w-80 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:bg-gray-700"
              onClick={() => setCurrentView("search")}
            />
          </div>

          {user ? (
            <>
              {user.subscription_plan === "basic" && (
                <Button
                  className="bg-white text-black hover:bg-gray-200 font-medium px-6"
                  onClick={() => setCurrentView("subscription")}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Mejorar
                </Button>
              )}
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  onClick={() => setShowAdminDashboard(true)}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setCurrentView("profile")}
                className="text-gray-400 hover:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                {user.full_name || user.email.split("@")[0]}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Iniciar Sesión
              </Button>
              <Button onClick={() => setShowRegister(true)} className="bg-green-500 hover:bg-green-600 text-black">
                Registrarse
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
            className="text-gray-400 hover:text-white"
            title={rightPanelMode === "full" ? "Modo compacto" : rightPanelMode === "compact" ? "Cerrar panel" : "Mostrar panel"}
          >
            {rightPanelMode === "hidden" ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-32">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {user ? `Hola, ${user.full_name?.split(" ")[0] || user.email.split("@")[0]}` : "Bienvenido a AuraRadio"}
          </h1>
          <p className="text-gray-400">
            {user
              ? "Descubre música personalizada para ti"
              : "Inicia sesión para obtener recomendaciones personalizadas"}
          </p>
        </div>

        {/* Loading State */}
        {musicLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-700 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for New Users */}
        {!musicLoading && user && !hasEnoughPlays && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">¡Comienza tu viaje musical!</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Escucha más música para que podamos crear recomendaciones personalizadas para ti. Necesitas al menos 10
              reproducciones para desbloquear tus radios personalizadas.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={() => setCurrentView("search")} className="bg-green-500 hover:bg-green-600 text-black">
                <Search className="w-4 h-4 mr-2" />
                Explorar Música
              </Button>
              <Button variant="outline" onClick={() => setCurrentView("trends")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Tendencias
              </Button>
            </div>
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg max-w-md mx-auto">
              <p className="text-blue-300 text-sm">
                💡 <strong>Tip:</strong> Mientras más escuches, mejores serán nuestras recomendaciones de IA
              </p>
            </div>
          </div>
        )}

        {/* Content for Users with Enough Plays */}
        {!musicLoading && user && hasEnoughPlays && (
          <div className="space-y-8">
            {/* AI Insights */}
            <AIInsights />

            {/* Quick Access */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Acceso Rápido</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {playlists.slice(0, 6).map((playlist) => (
                  <Card
                    key={playlist.id}
                    className="bg-gray-800/60 hover:bg-gray-700/60 border-gray-700 cursor-pointer transition-all duration-200 group"
                  >
                    <CardContent className="p-0 flex items-center">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-20 h-20 object-cover rounded-l-lg"
                      />
                      <div className="p-4 flex-1">
                        <p className="text-white font-medium">{playlist.name}</p>
                      </div>
                      <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          className="w-12 h-12 bg-green-500 hover:bg-green-400 text-black rounded-full"
                        >
                          <Music className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Made For You */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Hecho Para Ti</h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Ver todo
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {stations.map((station) => (
                  <Card
                    key={station.id}
                    className="bg-gray-800/40 hover:bg-gray-700/40 border-gray-700 cursor-pointer transition-all duration-200 group p-4"
                  >
                    <CardContent className="p-0">
                      <div className="relative mb-4">
                        <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Radio className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            className="w-12 h-12 bg-green-500 hover:bg-green-400 text-black rounded-full"
                          >
                            <Music className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-white font-medium mb-1">{station.name}</h3>
                      <p className="text-gray-400 text-sm">{station.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Guest Content */}
        {!user && !musicLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Descubre tu sonido perfecto</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Únete a AuraRadio y obtén recomendaciones musicales personalizadas con inteligencia artificial
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={() => setShowRegister(true)} className="bg-green-500 hover:bg-green-600 text-black px-8">
                Comenzar Gratis
              </Button>
              <Button variant="outline" onClick={() => setShowLogin(true)}>
                Iniciar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const toggleRightPanel = () => {
    if (rightPanelMode === "full") {
      setRightPanelMode("compact")
    } else if (rightPanelMode === "compact") {
      setRightPanelMode("hidden")
    } else {
      setRightPanelMode("full")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-black/50 backdrop-blur-sm border-r border-gray-800/50 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AuraRadio</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-2 mb-8">
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 ${currentView === "home" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                onClick={() => setCurrentView("home")}
              >
                <Music className="w-5 h-5 mr-3" />
                Inicio
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 ${currentView === "search" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
                onClick={() => setCurrentView("search")}
              >
                <Search className="w-5 h-5 mr-3" />
                Buscar
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 text-gray-400 hover:text-white">
                <Library className="w-5 h-5 mr-3" />
                Tu Biblioteca
              </Button>
            </nav>

            {/* Your Library */}
            {user && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium">Tu Biblioteca</h3>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
                    >
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{playlist.name}</p>
                        <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {renderCurrentView()}

        {/* Right Panel - Full Mode */}
        {rightPanelMode === "full" && (
          <div className="w-80 bg-black/50 backdrop-blur-sm border-l border-gray-800/50 p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Reproduciendo</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRightPanel}
                  className="text-gray-400 hover:text-white"
                  title="Modo compacto"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {currentSong ? (
              <div className="space-y-6">
                {/* Current Track */}
                <div className="text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Music className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{currentSong.title}</h3>
                  <p className="text-gray-400">{currentSong.artist}</p>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Shuffle className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={previousTrack}
                      className="text-gray-400 hover:text-white"
                    >
                      <SkipBack className="w-6 h-6" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={togglePlay}
                      className="bg-white text-black hover:bg-gray-200 w-12 h-12"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextTrack} className="text-gray-400 hover:text-white">
                      <SkipForward className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Repeat className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(currentSong.duration || 180)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-white rounded-full h-1 transition-all duration-300"
                        style={{ width: `${(progress / (currentSong.duration || 180)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 bg-gray-700 rounded-full h-1">
                      <div className="bg-white rounded-full h-1" style={{ width: `${volume}%` }} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                    <Heart className="w-4 h-4 mr-2" />
                    Me gusta
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    Añadir a playlist
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">No hay música reproduciéndose</p>
              </div>
            )}
          </div>
        )}

        {/* Right Panel - Compact Mode */}
        {rightPanelMode === "compact" && (
          <div className="w-20 bg-black/50 backdrop-blur-sm border-l border-gray-800/50 p-4 transition-all duration-300 flex flex-col items-center">
            {/* Toggle Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRightPanel}
                className="text-gray-400 hover:text-white w-12 h-12"
                title="Cerrar panel"
              >
                <PanelRightClose className="w-4 h-4" />
              </Button>
            </div>

            {currentSong ? (
              <div className="flex flex-col items-center space-y-6">
                {/* Compact Track Info */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>

                {/* Vertical Controls */}
                <div className="flex flex-col items-center space-y-4">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white w-12 h-12">
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={previousTrack}
                    className="text-gray-400 hover:text-white w-12 h-12"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="bg-white text-black hover:bg-gray-200 w-12 h-12"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextTrack}
                    className="text-gray-400 hover:text-white w-12 h-12"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white w-12 h-12">
                    <Repeat className="w-4 h-4" />
                  </Button>
                </div>

                {/* Vertical Volume Control */}
                <div className="flex flex-col items-center space-y-2 h-32">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <div className="w-1 flex-1 bg-gray-700 rounded-full relative">
                    <div
                      className="w-1 bg-white rounded-full absolute bottom-0"
                      style={{ height: `${volume}%` }}
                    />
                  </div>
                </div>

                {/* Like Button */}
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white w-12 h-12">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Music className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Control Panel (when right panel is hidden) */}
      {rightPanelMode === "hidden" && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-black/80 backdrop-blur-md border border-gray-700 rounded-full p-2 flex flex-col items-center space-y-2 shadow-2xl">
            {/* Expand Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRightPanel}
              className="text-gray-400 hover:text-white w-12 h-12 rounded-full hover:bg-gray-800"
              title="Mostrar panel"
            >
              <PanelRightOpen className="w-4 h-4" />
            </Button>

            {currentSong && (
              <>
                {/* Play/Pause */}
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="bg-green-500 hover:bg-green-600 text-black w-12 h-12 rounded-full"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                {/* Quick Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  className="text-gray-400 hover:text-white w-12 h-12 rounded-full hover:bg-gray-800"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousTrack}
                  className="text-gray-400 hover:text-white w-12 h-12 rounded-full hover:bg-gray-800"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white w-12 h-12 rounded-full hover:bg-gray-800"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Player Bar */}
      {currentSong && (
        <div className="sticky bottom-0 bg-black/80 backdrop-blur-md border-t border-gray-800/50 p-4">
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">{currentSong.title}</h4>
                <p className="text-gray-400 text-sm">{currentSong.artist}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`text-gray-400 hover:text-white ${isShuffled ? "text-green-400" : ""}`}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={previousTrack} className="text-gray-400 hover:text-white">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button size="icon" onClick={togglePlay} className="bg-white text-black hover:bg-gray-200 w-10 h-10">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={nextTrack} className="text-gray-400 hover:text-white">
                  <SkipForward className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRepeatMode(repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off")}
                  className={`text-gray-400 hover:text-white ${repeatMode !== "off" ? "text-green-400" : ""}`}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-gray-400">{formatTime(progress)}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-white rounded-full h-1 transition-all duration-300"
                    style={{ width: `${(progress / (currentSong.duration || 180)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{formatTime(currentSong.duration || 180)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="w-24 bg-gray-700 rounded-full h-1">
                <div className="bg-white rounded-full h-1" style={{ width: `${volume}%` }} />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
          onLogin={handleLogin}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onRegister={handleRegister}
        />
      )}
      {showOnboarding && <MusicPreferences onComplete={handleOnboardingComplete} />}
      {showVoiceControl && <VoiceControlModal />}
      {showAdminDashboard && <AdminDashboard onClose={() => setShowAdminDashboard(false)} />}
    </div>
  )
}
