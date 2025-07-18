"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Play,
  Pause,
  Heart,
  Mic,
  Radio,
  Search,
  Home,
  Library,
  Plus,
  ChevronRight,
  MoreHorizontal,
  ChevronLeft,
  User,
  Download,
  TrendingUp,
  Share2,
  Users,
  Crown,
  Settings,
} from "lucide-react"

// Import components
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"
import { MusicPreferences } from "@/components/onboarding/music-preferences"
import { ProfilePage } from "@/components/profile/profile-page"
import { JamsPage } from "@/components/jams/jams-page"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { PlanSelection } from "@/components/subscription/plan-selection"
import { TrendsPage } from "@/components/trends/trends-page"
import { SearchPage } from "@/components/search/search-page"
import { ArtistPage } from "@/components/artist/artist-page"
import { StationPage } from "@/components/station/station-page"
import { VoiceControlModal } from "@/components/voice/voice-control-modal"
import { SettingsPage } from "@/components/settings/settings-page"
import { FriendsManager } from "@/components/friends/friends-manager"

export default function ModernRadioPlatform() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [currentTime, setCurrentTime] = useState([45])
  const [menuPosition, setMenuPosition] = useState({ x: 50, y: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [showVoiceControl, setShowVoiceControl] = useState(false)

  // Auth and user state
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showJams, setShowJams] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showPlanSelection, setShowPlanSelection] = useState(false)
  const [showTrends, setShowTrends] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showArtistPage, setShowArtistPage] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [showStationPage, setShowStationPage] = useState(false)
  const [selectedStationDetail, setSelectedStationDetail] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showFriends, setShowFriends] = useState(false)

  // Voice and settings state
  const [isAuraEnabled, setIsAuraEnabled] = useState(true)
  const [userSettings, setUserSettings] = useState({})

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const menuRef = useRef<HTMLDivElement>(null)

  const quickAccess = [
    { name: "Morning Energy", image: "/placeholder.svg?height=80&width=80" },
    { name: "Focus Flow", image: "/placeholder.svg?height=80&width=80" },
    { name: "Chill Vibes", image: "/placeholder.svg?height=80&width=80" },
    { name: "Workout Beats", image: "/placeholder.svg?height=80&width=80" },
    { name: "Jazz Lounge", image: "/placeholder.svg?height=80&width=80" },
    { name: "Electronic Pulse", image: "/placeholder.svg?height=80&width=80" },
  ]

  const madeForYou = [
    {
      title: "Discover Weekly Radio",
      subtitle: "Your weekly mixtape of fresh music",
      image: "/placeholder.svg?height=200&width=200",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      title: "Daily Mix 1",
      subtitle: "The Weeknd, Dua Lipa, Ariana Grande and more",
      image: "/placeholder.svg?height=200&width=200",
      gradient: "from-green-600 to-teal-600",
    },
    {
      title: "AI Radio Station",
      subtitle: "Personalized just for you",
      image: "/placeholder.svg?height=200&width=200",
      gradient: "from-orange-600 to-red-600",
    },
  ]

  const recentStations = [
    { name: "Liked Stations", type: "Playlist • 47 stations", icon: "💚" },
    { name: "Global Hits FM", type: "Radio Station", icon: "📻" },
    { name: "Jazz Masters", type: "Radio Station", icon: "🎷" },
    { name: "Electronic Pulse", type: "Radio Station", icon: "⚡" },
    { name: "Chill Lo-Fi", type: "Radio Station", icon: "🌙" },
  ]

  // Auth handlers
  const handleLogin = (email: string, password: string) => {
    if (email === "test@example.com" && password === "password123") {
      setUser({ name: "Test User", email, plan: "free" })
      setShowLogin(false)
    } else if (email === "premium@example.com" && password === "premium123") {
      setUser({
        name: "Premium User",
        email,
        plan: "premium",
        joinDate: "March 2024",
        location: "New York, USA",
        bio: "Music lover and AI radio enthusiast with Premium access",
      })
      setShowLogin(false)
    } else {
      alert(
        "Invalid credentials. Try:\n\nFree Account:\ntest@example.com / password123\n\nPremium Account:\npremium@example.com / premium123",
      )
    }
  }

  const handleRegister = (userData: any) => {
    setUser({ ...userData, plan: "free" })
    setShowRegister(false)
    setShowPlanSelection(true) // Show plan selection for new users
  }

  const handleOnboardingComplete = (preferences: any) => {
    setUser((prev) => ({ ...prev, preferences }))
    setShowOnboarding(false)
  }

  const handleLogout = () => {
    setUser(null)
    setShowProfile(false)
    setShowSettings(false)
    setShowFriends(false)
    setShowJams(false)
    setShowTrends(false)
    setShowSearch(false)
    setShowArtistPage(false)
    setShowStationPage(false)
    setShowSubscription(false)
    setShowPlanSelection(false)
    setShowVoiceControl(false)
    // Reset any user-specific state
    setIsAuraEnabled(true)
    setUserSettings({})
  }

  const handlePlanSelection = (planId: string, billing: string) => {
    setUser((prev) => ({ ...prev, plan: planId }))
    setShowPlanSelection(false)
    if (planId !== "free") {
      setShowOnboarding(true) // Show onboarding after plan selection
    }
  }

  const handleStationSelect = (station) => {
    setSelectedStation(station)
    setShowRightPanel(true)
  }

  const handleCloseRightPanel = () => {
    setShowRightPanel(false)
    setSelectedStation(null)
  }

  const handleArtistSelect = (artist) => {
    setSelectedArtist(artist)
    setShowArtistPage(true)
  }

  const handleStationDetailSelect = (station) => {
    setSelectedStationDetail(station)
    setShowStationPage(true)
  }

  const handleVoiceCommand = (command: string, params?: any) => {
    console.log("Voice command received:", command, params)

    switch (command) {
      case "play":
        setIsPlaying(true)
        break
      case "pause":
        setIsPlaying(false)
        break
      case "next":
        // Handle next track
        break
      case "previous":
        // Handle previous track
        break
      case "volume":
        if (params?.level) {
          setVolume([params.level])
        }
        break
      case "search":
        if (params?.query) {
          setShowSearch(true)
        }
        break
      case "join_jam":
        setShowJams(true)
        break
      case "what_playing":
        // Show current track info
        break
      default:
        console.log("Unknown command:", command)
    }
  }

  const handleUpdateSettings = (newSettings: any) => {
    setUserSettings(newSettings)
  }

  const handleToggleAura = (enabled: boolean) => {
    setIsAuraEnabled(enabled)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = menuRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setMenuPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setMenuPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }

    // Event listener para mostrar suscripción desde perfil
    const handleShowSubscription = () => {
      setShowSubscription(true)
    }

    window.addEventListener("showSubscription", handleShowSubscription)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("showSubscription", handleShowSubscription)
    }
  }, [isDragging, dragOffset])

  return (
    <div className="h-screen bg-black text-white flex flex-col">
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

      {showPlanSelection && (
        <PlanSelection
          onClose={() => setShowPlanSelection(false)}
          onSelectPlan={handlePlanSelection}
          currentPlan={user?.plan || "free"}
          isNewUser={true}
        />
      )}

      {showOnboarding && <MusicPreferences onComplete={handleOnboardingComplete} />}

      {showProfile && user && <ProfilePage user={user} onClose={() => setShowProfile(false)} onLogout={handleLogout} />}

      {showJams && <JamsPage onClose={() => setShowJams(false)} />}

      {showSubscription && (
        <SubscriptionPlans onClose={() => setShowSubscription(false)} currentPlan={user?.plan || "free"} />
      )}

      {showTrends && (
        <TrendsPage
          onClose={() => setShowTrends(false)}
          onStationSelect={handleStationDetailSelect}
          onJamSelect={(jam) => {
            setShowTrends(false)
            setShowJams(true)
          }}
        />
      )}

      {showSearch && (
        <SearchPage
          onClose={() => setShowSearch(false)}
          onArtistSelect={handleArtistSelect}
          onStationSelect={handleStationDetailSelect}
          onJamSelect={(jam) => {
            setShowSearch(false)
            setShowJams(true)
          }}
        />
      )}

      {showArtistPage && selectedArtist && (
        <ArtistPage artist={selectedArtist} onClose={() => setShowArtistPage(false)} />
      )}

      {showStationPage && selectedStationDetail && (
        <StationPage station={selectedStationDetail} onClose={() => setShowStationPage(false)} />
      )}

      {showVoiceControl && (
        <VoiceControlModal
          onClose={() => setShowVoiceControl(false)}
          onVoiceCommand={handleVoiceCommand}
          isAuraEnabled={isAuraEnabled}
          onToggleAura={handleToggleAura}
        />
      )}

      {showSettings && user && (
        <SettingsPage
          user={user}
          onClose={() => setShowSettings(false)}
          onUpdateSettings={handleUpdateSettings}
          isAuraEnabled={isAuraEnabled}
          onToggleAura={handleToggleAura}
        />
      )}

      {showFriends && user && <FriendsManager user={user} onClose={() => setShowFriends(false)} />}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? "w-20" : "w-80"} bg-black p-6 flex flex-col transition-all duration-300`}>
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Radio className="w-5 h-5 text-black" />
            </div>
            {!sidebarCollapsed && <span className="text-xl font-bold">AuraRadio</span>}
          </div>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800 mb-4 self-start"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            <Button
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"} text-white hover:text-white hover:bg-gray-800 h-10`}
            >
              <Home className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && "Home"}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"} text-gray-400 hover:text-white hover:bg-gray-800 h-10`}
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && "Search"}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"} text-gray-400 hover:text-white hover:bg-gray-800 h-10`}
              onClick={() => setShowJams(true)}
            >
              <Users className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && "Jams"}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"} text-gray-400 hover:text-white hover:bg-gray-800 h-10`}
              onClick={() => setShowTrends(true)}
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && "Trends"}
            </Button>
            {user && (
              <Button
                variant="ghost"
                className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"} text-gray-400 hover:text-white hover:bg-gray-800 h-10`}
                onClick={() => setShowFriends(true)}
              >
                <Users className="w-5 h-5 mr-3" />
                {!sidebarCollapsed && "Friends"}
              </Button>
            )}
          </nav>

          {/* Your Library - Solo mostrar cuando no está colapsado */}
          {!sidebarCollapsed && (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-10 px-0">
                  <Library className="w-5 h-5 mr-3" />
                  Your Library
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex space-x-2 mb-4">
                <Badge variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer">
                  Stations
                </Badge>
                <Badge variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer">
                  Artists
                </Badge>
              </div>

              {/* Recent Stations */}
              <div className="space-y-2">
                {recentStations.map((station, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer group"
                    onClick={() => handleStationSelect(station)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center text-lg">
                      {station.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{station.name}</p>
                      <p className="text-gray-400 text-sm truncate">{station.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          {/* Top Bar */}
          <div className="sticky top-0 bg-gray-900/80 backdrop-blur-md p-4 flex items-center justify-between z-10">
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
                  placeholder="Search in Stations"
                  className="pl-10 w-80 bg-gray-800 border-none text-white placeholder:text-gray-400 focus:bg-gray-700"
                  onClick={() => setShowSearch(true)}
                />
              </div>

              {user ? (
                <>
                  {user.plan === "free" && (
                    <Button
                      className="bg-white text-black hover:bg-gray-200 font-medium px-6"
                      onClick={() => setShowPlanSelection(true)}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowProfile(true)}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="text-gray-400 hover:text-white text-sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                    onClick={() => setShowLogin(true)}
                  >
                    Log In
                  </Button>
                  <Button
                    className="bg-white text-black hover:bg-gray-200 font-medium px-6"
                    onClick={() => setShowRegister(true)}
                  >
                    Sign Up
                  </Button>
                </>
              )}

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pb-32">
            {/* Good Morning Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">
                {user ? `Good morning, ${user.name.split(" ")[0]}` : "Good morning"}
              </h1>
              <div className="grid grid-cols-3 gap-4">
                {quickAccess.map((item, index) => (
                  <Card
                    key={index}
                    className="bg-gray-800/60 hover:bg-gray-700/60 border-none cursor-pointer transition-colors group"
                    onClick={() => handleStationSelect({ name: item.name, type: "Quick Access Station", icon: "🎵" })}
                  >
                    <CardContent className="p-0 flex items-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-l-md"
                      />
                      <div className="p-4 flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                      </div>
                      <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          className="w-12 h-12 bg-green-500 hover:bg-green-400 text-black rounded-full"
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Made For You Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Made For You</h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white font-medium">
                  Show all
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {madeForYou.map((item, index) => (
                  <Card
                    key={index}
                    className="bg-gray-800/40 hover:bg-gray-700/40 border-none cursor-pointer transition-colors group p-4"
                    onClick={() => handleStationSelect({ name: item.title, type: "AI Generated Station", icon: "🤖" })}
                  >
                    <CardContent className="p-0">
                      <div className="relative mb-4">
                        <div className={`w-full h-48 bg-gradient-to-br ${item.gradient} rounded-md`}></div>
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            className="w-12 h-12 bg-green-500 hover:bg-green-400 text-black rounded-full"
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.subtitle}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Voice Assistant */}
            <Card className="bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Mic className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">AI Voice Assistant</h3>
                      <p className="text-green-200 text-sm">
                        {isAuraEnabled ? 'Say "Hey Aura" to get started' : "Voice control is disabled"}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-green-500 hover:bg-green-400 text-black font-medium"
                    onClick={() => setShowVoiceControl(true)}
                  >
                    {isAuraEnabled ? "Try Voice Control" : "Enable Voice Control"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Free Plan Limitations */}
            {user && user.plan === "free" && (
              <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Upgrade to Premium</h3>
                        <p className="text-yellow-200 text-sm">Unlock unlimited skips, high-quality audio, and more</p>
                      </div>
                    </div>
                    <Button
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
                      onClick={() => setShowPlanSelection(true)}
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Floating Control Menu - Solo mostrar cuando sidebar está colapsado */}
        {sidebarCollapsed && (
          <div
            ref={menuRef}
            className="fixed z-50 bg-black/20 backdrop-blur-md border border-white/10 rounded-full p-2 cursor-move select-none"
            style={{
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="flex flex-col space-y-3">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setShowJams(true)}
              >
                <Users className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setShowTrends(true)}
              >
                <TrendingUp className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setSidebarCollapsed(false)}
              >
                <Home className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => (user ? setShowProfile(true) : setShowLogin(true))}
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setShowSearch(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Right Panel - Station Details */}
        {showRightPanel && selectedStation && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Now Playing</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={handleCloseRightPanel}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Station Info */}
            <div className="text-center mb-8">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-4xl">
                {selectedStation.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedStation.name}</h3>
              <p className="text-gray-400">{selectedStation.type}</p>
            </div>

            {/* Current Track */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Current Track</h4>
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <img src="/placeholder.svg?height=48&width=48" alt="Track" className="w-12 h-12 rounded" />
                <div>
                  <p className="text-white font-medium">Believer</p>
                  <p className="text-gray-400 text-sm">Imagine Dragons</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">AI Insights</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <p className="text-green-200 text-sm">🤖 This station matches your evening mood perfectly</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <p className="text-blue-200 text-sm">📊 32% more engaging than your usual stations</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-medium">
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share Station
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                Report Station
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Audio Player */}
      <div className="sticky bottom-0 bg-black/80 backdrop-blur-md h-24 p-4 flex items-center justify-between border-t border-gray-800 z-20">
        {/* Track Info */}
        <div className="flex items-center space-x-4">
          <img src="/placeholder.svg?height=56&width=56" alt="Track" className="w-14 h-14 rounded" />
          <div>
            <p className="text-white font-medium">Believer</p>
            <p className="text-gray-400 text-sm">Imagine Dragons</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-white hover:text-white rounded-full bg-gray-800"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M9.316 3.354a6 6 0 00-8.662 8.662l.862.862a6 6 0 108.662-8.662l-.862-.862zM11.684 5.646a4 4 0 00-5.656 5.656l.862.862a4 4 0 105.656-5.656l-.862-.862zM15 8a3 3 0 00-2.536 2.769l.862.862A3 3 0 1015 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={volume[0]}
            className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            onChange={(e) => setVolume([Number.parseInt(e.target.value)])}
          />
        </div>
      </div>
    </div>
  )
}
