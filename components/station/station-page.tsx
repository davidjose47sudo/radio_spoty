"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Heart, MoreHorizontal, Share2, X } from "lucide-react"

interface StationPageProps {
  station: any
  onClose: () => void
}

export function StationPage({ station, onClose }: StationPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const currentTrack = {
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:03",
    image: "/placeholder.svg?height=60&width=60",
  }

  const upcomingTracks = [
    {
      id: 1,
      title: "Strobe",
      artist: "Deadmau5",
      album: "For Lack of a Better Name",
      duration: "10:34",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "Breathe Me",
      artist: "Sia",
      album: "Colour the Small One",
      duration: "4:32",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "Teardrop",
      artist: "Massive Attack",
      album: "Mezzanine",
      duration: "5:30",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "Intro",
      artist: "The xx",
      album: "xx",
      duration: "2:08",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      title: "Adagio for Strings",
      artist: "Samuel Barber",
      album: "Adagio for Strings",
      duration: "8:00",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const stationInfo = {
    description:
      "Global Hits FM brings you the most popular songs from around the world, 24/7. Tune in for a mix of pop, dance, and trending tracks.",
    listeners: "125,400",
    genre: "Pop, Dance, Top 40",
    language: "English",
    origin: "Global",
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        {/* Header */}
        <div className="relative">
          <div className="h-80 bg-gradient-to-b from-blue-600/40 to-gray-900 p-8">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="flex items-end space-x-6 h-full">
              <div className="relative">
                <img
                  src={station.image || "/placeholder.svg"}
                  alt={station.name}
                  className="w-48 h-48 rounded-lg object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
              </div>

              <div className="flex-1 pb-4">
                <Badge className="bg-green-500/20 text-green-300 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </Badge>
                <h1 className="text-6xl font-bold text-white mb-4">{station.name}</h1>

                <div className="flex items-center space-x-4 text-white">
                  <span className="text-lg">{stationInfo.listeners} listeners</span>
                  <span>•</span>
                  <span className="text-lg">{stationInfo.genre}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gradient-to-b from-gray-900/80 to-gray-900 p-8">
            <div className="flex items-center space-x-6">
              <Button
                size="icon"
                className="w-14 h-14 bg-green-500 hover:bg-green-600 text-black rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <Button
                variant="outline"
                className={`px-8 ${
                  isFavorited
                    ? "border-green-500 text-green-400 hover:bg-green-500/20 bg-transparent"
                    : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                }`}
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className="w-5 h-5 mr-2" />
                {isFavorited ? "Favorited" : "Add to Favorites"}
              </Button>

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-700 rounded-none h-auto p-0 mb-8">
              {["overview", "queue", "info"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize bg-transparent text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-4 py-2"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Current Track */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Now Playing</h2>
                <Card className="bg-gray-800/50 border-gray-700 p-6 flex items-center space-x-6">
                  <img
                    src={currentTrack.image || "/placeholder.svg"}
                    alt={currentTrack.title}
                    className="w-24 h-24 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{currentTrack.title}</h3>
                    <p className="text-gray-400 text-lg">
                      {currentTrack.artist} • {currentTrack.album}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Upcoming Tracks */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Upcoming Tracks</h2>
                <div className="space-y-2">
                  {upcomingTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center space-x-4 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer group"
                    >
                      <div className="w-6 text-center">
                        <span className="text-gray-400 text-sm group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block" />
                      </div>
                      <div className="relative">
                        <img
                          src={track.image || "/placeholder.svg"}
                          alt={track.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{track.title}</p>
                        <p className="text-gray-400 text-sm">{track.artist}</p>
                      </div>
                      <div className="text-gray-400 text-sm hidden md:block">{track.album}</div>
                      <div className="text-gray-400 text-sm">{track.duration}</div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="queue" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Station Queue</h2>
                <div className="space-y-2">
                  {upcomingTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center space-x-4 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer group"
                    >
                      <div className="w-6 text-center">
                        <span className="text-gray-400 text-sm group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block" />
                      </div>
                      <div className="relative">
                        <img
                          src={track.image || "/placeholder.svg"}
                          alt={track.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{track.title}</p>
                        <p className="text-gray-400 text-sm">{track.artist}</p>
                      </div>
                      <div className="text-gray-400 text-sm hidden md:block">{track.album}</div>
                      <div className="text-gray-400 text-sm">{track.duration}</div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">About This Station</h2>
                <Card className="bg-gray-800/50 border-gray-700 p-6 space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Description</h3>
                    <p className="text-gray-400 text-sm">{stationInfo.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">Listeners</h3>
                      <p className="text-gray-400 text-sm">{stationInfo.listeners}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Genre</h3>
                      <p className="text-gray-400 text-sm">{stationInfo.genre}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Language</h3>
                      <p className="text-gray-400 text-sm">{stationInfo.language}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Origin</h3>
                      <p className="text-gray-400 text-sm">{stationInfo.origin}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
