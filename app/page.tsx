"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Mic,
  Zap,
} from "lucide-react"

// Import components
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"
import { MusicPreferences } from "@/components/onboarding/music-preferences"
import { ProfilePage } from "@/components/profile/profile-page"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { TrendsPage } from "@/components/trends/trends-page"
import { ArtistPage } from "@/components/artist/artist-page"
import { StationPage } from "@/components/station/station-page"
import { SearchPage } from "@/components/search/search-page"
import { JamsPage } from "@/components/jams/jams-page"
import { FriendsManager } from "@/components/friends/friends-manager"
import { SettingsPage } from "@/components/settings/settings-page"
import { VoiceControlModal } from "@/components/voice/voice-control-modal"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

// Import hooks and utilities
import { useMusicAPI } from "@/components/music-api"
import { AIInsights } from "@/components/ai-features"
import { getCurrentUser, type AuthUser } from "@/lib/auth"

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentView, setCurrentView] = useState("home")
  const [showVoiceControl, setShowVoiceControl] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<any>(null)
  const [currentStation, setCurrentStation] = useState<any>(null)
  const [volume, setVolume] = useState(75)
  const [progress, setProgress] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off")

  // Use music API hook
  const { stations, tracks, loading: musicLoading } = useMusicAPI()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // Check if user needs onboarding
      if (currentUser && !currentUser.full_name) {
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    setShowLogin(false)
    checkAuth()
  }

  const handleRegister = () => {
    setShowRegister(false)
    setShowOnboarding(true)
    checkAuth()
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    checkAuth()
  }

  const playStation = (station: any) => {
    setCurrentStation(station)
    if (station.songs && station.songs.length > 0) {
      setCurrentSong(station.songs[0])
      setIsPlaying(true)
    }
  }

  const playTrack = (track: any) => {
    setCurrentSong(track)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    if (currentStation?.songs) {
      const currentIndex = currentStation.songs.findIndex((s: any) => s.id === currentSong?.id)
      const nextIndex = (currentIndex + 1) % currentStation.songs.length
      setCurrentSong(currentStation.songs[nextIndex])
    }
  }

  const previousTrack = () => {
    if (currentStation?.songs) {
      const currentIndex = currentStation.songs.findIndex((s: any) => s.id === currentSong?.id)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentStation.songs.length - 1
      setCurrentSong(currentStation.songs[prevIndex])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading AuraRadio...</div>
      </div>
    )
  }

  // Render different views based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case "profile":
        return <ProfilePage user={user} onClose={() => setCurrentView("home")} />
      case "subscription":
        return <SubscriptionPlans onClose={() => setCurrentView("home")} />
      case "trends":
        return <TrendsPage onClose={() => setCurrentView("home")} />
      case "artist":
        return <ArtistPage artistId="sample-artist" onClose={() => setCurrentView("home")} />
      case "station":
        return <StationPage stationId="sample-station" onClose={() => setCurrentView("home")} />
      case "search":
        return <SearchPage onClose={() => setCurrentView("home")} />
      case "jams":
        return <JamsPage onClose={() => setCurrentView("home")} />
      case "friends":
        return <FriendsManager onClose={() => setCurrentView("home")} />
      case "settings":
        return <SettingsPage onClose={() => setCurrentView("home")} />
      default:
        return renderHomeView()
    }
  }

  const renderHomeView = () => (
    <div className="flex-1 overflow-y-auto p-6 pb-32">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to AuraRadio</h1>
          <p className="text-xl mb-6">Discover your perfect sound with AI-powered radio stations</p>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowVoiceControl(true)} className="bg-white text-purple-600 hover:bg-gray-100">
              <Mic className="w-4 h-4 mr-2" />
              Voice Control
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate AI Radio
            </Button>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {user && <AIInsights user={user} />}

      {/* Featured Stations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Featured Stations</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.slice(0, 6).map((station) => (
            <Card
              key={station.id}
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Radio className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{station.name}</h3>
                    <p className="text-gray-400 text-sm">{station.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {station.genre}
                      </Badge>
                      <span className="text-gray-500 text-xs">{station.listeners} listeners</span>
                    </div>
                  </div>
                  <Button size="icon" onClick={() => playStation(station)} className="bg-green-500 hover:bg-green-600">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Popular Tracks</h2>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {tracks.slice(0, 10).map((track, index) => (
            <div
              key={track.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <div className="w-8 text-gray-400 text-sm font-medium">{index + 1}</div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{track.title}</h4>
                <p className="text-gray-400 text-sm">{track.artist}</p>
              </div>
              <div className="text-gray-400 text-sm">{formatTime(track.duration)}</div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AuraRadio</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("home")}
              className={currentView === "home" ? "text-white" : "text-gray-400 hover:text-white"}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("search")}
              className={currentView === "search" ? "text-white" : "text-gray-400 hover:text-white"}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("trends")}
              className={currentView === "trends" ? "text-white" : "text-gray-400 hover:text-white"}
            >
              Trends
            </Button>
            {user && (
              <Button
                variant="ghost"
                onClick={() => setCurrentView("jams")}
                className={currentView === "jams" ? "text-white" : "text-gray-400 hover:text-white"}
              >
                Jams
              </Button>
            )}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
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
                {user.full_name || user.email}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentView("settings")}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
              <Button onClick={() => setShowRegister(true)} className="bg-purple-600 hover:bg-purple-700">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {user && (
          <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-2">Your Library</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white"
                    onClick={() => setCurrentView("profile")}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white"
                    onClick={() => setCurrentView("friends")}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Friends
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-2">Quick Access</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white"
                    onClick={() => setCurrentView("subscription")}
                  >
                    <Zap className="w-4 h-4 mr-3" />
                    Upgrade
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        {renderCurrentView()}
      </div>

      {/* Music Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-400" />
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
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLogin} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={handleRegister} />}
      {showOnboarding && <MusicPreferences onComplete={handleOnboardingComplete} />}
      {showVoiceControl && <VoiceControlModal onClose={() => setShowVoiceControl(false)} />}
      {showAdminDashboard && <AdminDashboard onClose={() => setShowAdminDashboard(false)} />}
    </div>
  )
}
