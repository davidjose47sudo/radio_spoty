"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Play,
  Users,
  Heart,
  Share2,
  Clock,
  Music,
  Headphones,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"

interface TrendsPageProps {
  onClose: () => void
  onStationSelect: (station: any) => void
  onJamSelect: (jam: any) => void
}

export function TrendsPage({ onClose, onStationSelect, onJamSelect }: TrendsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  const trendingStations = [
    {
      id: 1,
      name: "Global Hits FM",
      genre: "Pop",
      listeners: 125400,
      change: "+15%",
      trend: "up",
      position: 1,
      previousPosition: 3,
      image: "/placeholder.svg?height=80&width=80",
      description: "The biggest hits from around the world",
      currentTrack: "Flowers - Miley Cyrus",
    },
    {
      id: 2,
      name: "Electronic Pulse",
      genre: "Electronic",
      listeners: 98200,
      change: "+8%",
      trend: "up",
      position: 2,
      previousPosition: 2,
      image: "/placeholder.svg?height=80&width=80",
      description: "Electronic beats and ambient sounds",
      currentTrack: "Strobe - Deadmau5",
    },
    {
      id: 3,
      name: "Chill Vibes Radio",
      genre: "Chill",
      listeners: 87600,
      change: "+22%",
      trend: "up",
      position: 3,
      previousPosition: 7,
      image: "/placeholder.svg?height=80&width=80",
      description: "Perfect for relaxation and focus",
      currentTrack: "Weightless - Marconi Union",
    },
    {
      id: 4,
      name: "Hip Hop Central",
      genre: "Hip Hop",
      listeners: 76300,
      change: "-5%",
      trend: "down",
      position: 4,
      previousPosition: 1,
      image: "/placeholder.svg?height=80&width=80",
      description: "Latest hip hop and rap hits",
      currentTrack: "God's Plan - Drake",
    },
    {
      id: 5,
      name: "Indie Discovery",
      genre: "Indie",
      listeners: 65800,
      change: "+12%",
      trend: "up",
      position: 5,
      previousPosition: 6,
      image: "/placeholder.svg?height=80&width=80",
      description: "Discover new indie and alternative artists",
      currentTrack: "Electric Feel - MGMT",
    },
  ]

  const trendingJams = [
    {
      id: 1,
      name: "Weekend Vibes 🌅",
      host: "Sarah M.",
      listeners: 247,
      genre: "Chill/Electronic",
      change: "+45%",
      trend: "up",
      position: 1,
      previousPosition: 4,
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Midnight City - M83",
      duration: "2h 15m",
    },
    {
      id: 2,
      name: "Study Focus Group",
      host: "Emma L.",
      listeners: 189,
      genre: "Lo-fi/Ambient",
      change: "+28%",
      trend: "up",
      position: 2,
      previousPosition: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Lofi Hip Hop Beat",
      duration: "4h 32m",
    },
    {
      id: 3,
      name: "Workout Energy 💪",
      host: "Alex R.",
      listeners: 156,
      genre: "Electronic/Hip Hop",
      change: "+18%",
      trend: "up",
      position: 3,
      previousPosition: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Stronger - Kanye West",
      duration: "1h 45m",
    },
    {
      id: 4,
      name: "Late Night Jazz Session",
      host: "Marcus J.",
      listeners: 134,
      genre: "Jazz",
      change: "-12%",
      trend: "down",
      position: 4,
      previousPosition: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Take Five - Dave Brubeck",
      duration: "3h 20m",
    },
    {
      id: 5,
      name: "Indie Rock Discoveries",
      host: "Luna P.",
      listeners: 98,
      genre: "Indie Rock",
      change: "+35%",
      trend: "up",
      position: 5,
      previousPosition: 8,
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Do I Wanna Know? - Arctic Monkeys",
      duration: "2h 50m",
    },
  ]

  const trendingTracks = [
    {
      id: 1,
      title: "Flowers",
      artist: "Miley Cyrus",
      plays: "2.4M",
      change: "+25%",
      trend: "up",
      position: 1,
      previousPosition: 3,
      duration: "3:20",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      title: "Anti-Hero",
      artist: "Taylor Swift",
      plays: "2.1M",
      change: "+18%",
      trend: "up",
      position: 2,
      previousPosition: 2,
      duration: "3:20",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      title: "As It Was",
      artist: "Harry Styles",
      plays: "1.9M",
      change: "-8%",
      trend: "down",
      position: 3,
      previousPosition: 1,
      duration: "2:47",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 4,
      title: "Unholy",
      artist: "Sam Smith ft. Kim Petras",
      plays: "1.7M",
      change: "+42%",
      trend: "up",
      position: 4,
      previousPosition: 7,
      duration: "2:36",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 5,
      title: "Bad Habit",
      artist: "Steve Lacy",
      plays: "1.5M",
      change: "+15%",
      trend: "up",
      position: 5,
      previousPosition: 6,
      duration: "3:51",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") return <ArrowUp className="w-4 h-4 text-green-400" />
    if (trend === "down") return <ArrowDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getPositionChange = (current: number, previous: number) => {
    const diff = previous - current
    if (diff > 0) return `+${diff}`
    if (diff < 0) return `${diff}`
    return "—"
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Trending Now</CardTitle>
                <p className="text-gray-400">What's hot on AuraRadio</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-800 rounded-lg p-1">
                {["today", "week", "month"].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "ghost"}
                    size="sm"
                    className={`capitalize ${
                      selectedPeriod === period
                        ? "bg-green-500 text-black hover:bg-green-600"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="stations" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="stations" className="text-white">
                Radio Stations
              </TabsTrigger>
              <TabsTrigger value="jams" className="text-white">
                Jams
              </TabsTrigger>
              <TabsTrigger value="tracks" className="text-white">
                Tracks
              </TabsTrigger>
              <TabsTrigger value="genres" className="text-white">
                Genres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stations" className="space-y-4">
              <div className="grid gap-4">
                {trendingStations.map((station, index) => (
                  <Card
                    key={station.id}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => onStationSelect(station)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Position */}
                        <div className="flex flex-col items-center w-12">
                          <span className="text-2xl font-bold text-white">{station.position}</span>
                          <div className="flex items-center text-xs text-gray-400">
                            {getTrendIcon(station.trend, 0)}
                            <span className="ml-1">
                              {getPositionChange(station.position, station.previousPosition)}
                            </span>
                          </div>
                        </div>

                        {/* Station Image */}
                        <div className="relative">
                          <img
                            src={station.image || "/placeholder.svg"}
                            alt={station.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Station Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-medium">{station.name}</h3>
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              {station.genre}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{station.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Headphones className="w-4 h-4" />
                              <span>{station.listeners.toLocaleString()} listeners</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Music className="w-4 h-4" />
                              <span>{station.currentTrack}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${station.trend === "up" ? "text-green-400" : "text-red-400"}`}
                          >
                            {station.change}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jams" className="space-y-4">
              <div className="grid gap-4">
                {trendingJams.map((jam, index) => (
                  <Card
                    key={jam.id}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => onJamSelect(jam)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Position */}
                        <div className="flex flex-col items-center w-12">
                          <span className="text-2xl font-bold text-white">{jam.position}</span>
                          <div className="flex items-center text-xs text-gray-400">
                            {getTrendIcon(jam.trend, 0)}
                            <span className="ml-1">{getPositionChange(jam.position, jam.previousPosition)}</span>
                          </div>
                        </div>

                        {/* Host Avatar */}
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={jam.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-purple-500 text-white text-lg">
                            {jam.host
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        {/* Jam Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-medium">{jam.name}</h3>
                            <Badge className="bg-green-500/20 text-green-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                              LIVE
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">Hosted by {jam.host}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{jam.listeners} listening</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{jam.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Music className="w-4 h-4" />
                              <span>{jam.currentSong}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${jam.trend === "up" ? "text-green-400" : "text-red-400"}`}
                          >
                            {jam.change}
                          </div>
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300 mt-2">
                            {jam.genre}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tracks" className="space-y-4">
              <div className="space-y-2">
                {trendingTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer group"
                  >
                    {/* Position */}
                    <div className="flex flex-col items-center w-12">
                      <span className="text-lg font-bold text-white">{track.position}</span>
                      <div className="flex items-center text-xs text-gray-400">
                        {getTrendIcon(track.trend, 0)}
                        <span className="ml-1">{getPositionChange(track.position, track.previousPosition)}</span>
                      </div>
                    </div>

                    {/* Track Image */}
                    <div className="relative">
                      <img
                        src={track.image || "/placeholder.svg"}
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1">
                      <p className="text-white font-medium">{track.title}</p>
                      <p className="text-gray-400 text-sm">{track.artist}</p>
                    </div>

                    {/* Duration */}
                    <div className="text-gray-400 text-sm">{track.duration}</div>

                    {/* Plays */}
                    <div className="text-right w-20">
                      <p className="text-white font-medium">{track.plays}</p>
                      <p className={`text-sm ${track.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                        {track.change}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="genres" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: "Pop", growth: "+15%", color: "from-pink-500 to-rose-500" },
                  { name: "Electronic", growth: "+22%", color: "from-blue-500 to-cyan-500" },
                  { name: "Hip Hop", growth: "+8%", color: "from-purple-500 to-violet-500" },
                  { name: "Rock", growth: "+5%", color: "from-red-500 to-orange-500" },
                  { name: "Jazz", growth: "+18%", color: "from-yellow-500 to-amber-500" },
                  { name: "Classical", growth: "+12%", color: "from-green-500 to-emerald-500" },
                  { name: "R&B", growth: "+25%", color: "from-indigo-500 to-blue-500" },
                  { name: "Country", growth: "+7%", color: "from-orange-500 to-red-500" },
                ].map((genre, index) => (
                  <Card
                    key={genre.name}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div
                        className={`w-full h-32 bg-gradient-to-br ${genre.color} rounded-lg mb-3 flex items-center justify-center`}
                      >
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-medium mb-1">{genre.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 text-sm font-medium">{genre.growth}</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
