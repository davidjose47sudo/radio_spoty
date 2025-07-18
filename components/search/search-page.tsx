"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Heart, MoreHorizontal, Users, Music, X } from "lucide-react"

interface SearchPageProps {
  onClose: () => void
  onArtistSelect: (artist: any) => void
  onStationSelect: (station: any) => void
  onJamSelect: (jam: any) => void
}

export function SearchPage({ onClose, onArtistSelect, onStationSelect, onJamSelect }: SearchPageProps) {
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState([
    "The Weeknd",
    "Electronic Pulse",
    "Chill Vibes",
    "Jazz Masters",
    "Workout Beats",
  ])

  const topResults = [
    {
      type: "artist",
      name: "The Weeknd",
      subtitle: "Artist • 85.2M monthly listeners",
      image: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
    {
      type: "station",
      name: "Global Hits FM",
      subtitle: "Radio Station • 125K listeners",
      image: "/placeholder.svg?height=60&width=60",
      genre: "Pop",
    },
    {
      type: "track",
      name: "Blinding Lights",
      artist: "The Weeknd",
      subtitle: "Track • 2.8B plays",
      image: "/placeholder.svg?height=60&width=60",
      duration: "3:20",
    },
  ]

  const tracks = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      plays: "2.8B",
      image: "/placeholder.svg?height=40&width=40",
      explicit: false,
    },
    {
      id: 2,
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:35",
      plays: "1.9B",
      image: "/placeholder.svg?height=40&width=40",
      explicit: false,
    },
    {
      id: 3,
      title: "Can't Feel My Face",
      artist: "The Weeknd",
      album: "Beauty Behind the Madness",
      duration: "3:35",
      plays: "1.5B",
      image: "/placeholder.svg?height=40&width=40",
      explicit: true,
    },
    {
      id: 4,
      title: "Starboy",
      artist: "The Weeknd ft. Daft Punk",
      album: "Starboy",
      duration: "3:50",
      plays: "2.1B",
      image: "/placeholder.svg?height=40&width=40",
      explicit: true,
    },
    {
      id: 5,
      title: "The Hills",
      artist: "The Weeknd",
      album: "Beauty Behind the Madness",
      duration: "4:02",
      plays: "1.7B",
      image: "/placeholder.svg?height=40&width=40",
      explicit: true,
    },
  ]

  const artists = [
    {
      id: 1,
      name: "The Weeknd",
      monthlyListeners: "85.2M",
      image: "/placeholder.svg?height=160&width=160",
      verified: true,
      genre: "R&B, Pop",
    },
    {
      id: 2,
      name: "Billie Eilish",
      monthlyListeners: "73.8M",
      image: "/placeholder.svg?height=160&width=160",
      verified: true,
      genre: "Alternative, Pop",
    },
    {
      id: 3,
      name: "Drake",
      monthlyListeners: "78.5M",
      image: "/placeholder.svg?height=160&width=160",
      verified: true,
      genre: "Hip Hop, Rap",
    },
    {
      id: 4,
      name: "Taylor Swift",
      monthlyListeners: "82.1M",
      image: "/placeholder.svg?height=160&width=160",
      verified: true,
      genre: "Pop, Country",
    },
  ]

  const stations = [
    {
      id: 1,
      name: "Global Hits FM",
      description: "The biggest hits from around the world",
      listeners: 125400,
      genre: "Pop",
      image: "/placeholder.svg?height=160&width=160",
      currentTrack: "Flowers - Miley Cyrus",
    },
    {
      id: 2,
      name: "Electronic Pulse",
      description: "Electronic beats and ambient sounds",
      listeners: 98200,
      genre: "Electronic",
      image: "/placeholder.svg?height=160&width=160",
      currentTrack: "Strobe - Deadmau5",
    },
    {
      id: 3,
      name: "Chill Vibes Radio",
      description: "Perfect for relaxation and focus",
      listeners: 87600,
      genre: "Chill",
      image: "/placeholder.svg?height=160&width=160",
      currentTrack: "Weightless - Marconi Union",
    },
  ]

  const jams = [
    {
      id: 1,
      name: "Weekend Vibes 🌅",
      host: "Sarah M.",
      listeners: 247,
      genre: "Chill/Electronic",
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Midnight City - M83",
      isLive: true,
    },
    {
      id: 2,
      name: "Study Focus Group",
      host: "Emma L.",
      listeners: 189,
      genre: "Lo-fi/Ambient",
      avatar: "/placeholder.svg?height=40&width=40",
      currentSong: "Lofi Hip Hop Beat",
      isLive: true,
    },
  ]

  const removeRecentSearch = (searchTerm: string) => {
    setRecentSearches(recentSearches.filter((term) => term !== searchTerm))
  }

  const clearAllSearches = () => {
    setRecentSearches([])
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 z-10">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="What do you want to listen to?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-800 border-gray-600 text-white text-lg focus:bg-gray-700"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {!query ? (
            // Recent Searches & Browse
            <div className="space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Recent searches</h2>
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white text-sm"
                      onClick={clearAllSearches}
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-full cursor-pointer group"
                        onClick={() => setQuery(search)}
                      >
                        <span className="text-white text-sm">{search}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeRecentSearch(search)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Categories */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Pop", color: "from-pink-500 to-rose-500" },
                    { name: "Hip Hop", color: "from-purple-500 to-violet-500" },
                    { name: "Rock", color: "from-red-500 to-orange-500" },
                    { name: "Electronic", color: "from-blue-500 to-cyan-500" },
                    { name: "Jazz", color: "from-yellow-500 to-amber-500" },
                    { name: "Classical", color: "from-green-500 to-emerald-500" },
                    { name: "R&B", color: "from-indigo-500 to-blue-500" },
                    { name: "Country", color: "from-orange-500 to-red-500" },
                  ].map((category) => (
                    <Card
                      key={category.name}
                      className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer overflow-hidden"
                    >
                      <div className={`h-32 bg-gradient-to-br ${category.color} relative`}>
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-white font-bold text-lg">{category.name}</h3>
                        </div>
                        <div className="absolute top-2 right-2 opacity-60">
                          <Music className="w-8 h-8 text-white transform rotate-12" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Search Results
            <div className="space-y-6">
              {/* Top Result */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Top result</h2>
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer p-6 max-w-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={topResults[0].image || "/placeholder.svg"}
                      alt={topResults[0].name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{topResults[0].name}</h3>
                      <div className="flex items-center space-x-2">
                        {topResults[0].verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <p className="text-gray-400">{topResults[0].subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4 bg-green-500 hover:bg-green-600 text-black font-medium rounded-full px-8">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </Card>
              </div>

              {/* Search Results Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent border-b border-gray-700 rounded-none h-auto p-0">
                  {["all", "tracks", "artists", "stations", "jams"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="capitalize bg-transparent text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none px-4 py-2"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="space-y-8 mt-6">
                  {/* Tracks Section */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Songs</h3>
                    <div className="space-y-2">
                      {tracks.slice(0, 4).map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center space-x-4 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer group"
                        >
                          <div className="relative">
                            <img
                              src={track.image || "/placeholder.svg"}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-white font-medium">{track.title}</p>
                              {track.explicit && (
                                <Badge variant="secondary" className="bg-gray-600 text-gray-300 text-xs px-1 py-0">
                                  E
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{track.artist}</p>
                          </div>
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

                  {/* Artists Section */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Artists</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {artists.slice(0, 4).map((artist) => (
                        <Card
                          key={artist.id}
                          className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                          onClick={() => onArtistSelect(artist)}
                        >
                          <div className="text-center">
                            <div className="relative mb-4">
                              <img
                                src={artist.image || "/placeholder.svg"}
                                alt={artist.name}
                                className="w-32 h-32 rounded-full object-cover mx-auto"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  className="w-12 h-12 bg-green-500 hover:bg-green-600 text-black rounded-full"
                                >
                                  <Play className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <h3 className="text-white font-medium">{artist.name}</h3>
                              {artist.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">Artist</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tracks" className="mt-6">
                  <div className="space-y-2">
                    {tracks.map((track, index) => (
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
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{track.title}</p>
                            {track.explicit && (
                              <Badge variant="secondary" className="bg-gray-600 text-gray-300 text-xs px-1 py-0">
                                E
                              </Badge>
                            )}
                          </div>
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
                </TabsContent>

                <TabsContent value="artists" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {artists.map((artist) => (
                      <Card
                        key={artist.id}
                        className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                        onClick={() => onArtistSelect(artist)}
                      >
                        <div className="text-center">
                          <div className="relative mb-4">
                            <img
                              src={artist.image || "/placeholder.svg"}
                              alt={artist.name}
                              className="w-full aspect-square rounded-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-black rounded-full"
                              >
                                <Play className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <h3 className="text-white font-medium truncate">{artist.name}</h3>
                            {artist.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">Artist</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="stations" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stations.map((station) => (
                      <Card
                        key={station.id}
                        className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                        onClick={() => onStationSelect(station)}
                      >
                        <div className="relative mb-4">
                          <img
                            src={station.image || "/placeholder.svg"}
                            alt={station.name}
                            className="w-full aspect-square rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              className="w-12 h-12 bg-green-500 hover:bg-green-600 text-black rounded-full"
                            >
                              <Play className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-medium">{station.name}</h3>
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              {station.genre}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{station.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{station.listeners.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Music className="w-4 h-4" />
                              <span className="truncate">{station.currentTrack}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="jams" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jams.map((jam) => (
                      <Card
                        key={jam.id}
                        className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                        onClick={() => onJamSelect(jam)}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={jam.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-purple-500 text-white">
                              {jam.host
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-white font-medium">{jam.name}</h3>
                              {jam.isLive && (
                                <Badge className="bg-green-500/20 text-green-300">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                  LIVE
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">Hosted by {jam.host}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{jam.listeners} listening</span>
                              </div>
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                {jam.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
