"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Heart, MoreHorizontal, X } from "lucide-react"

interface ArtistPageProps {
  artist: any
  onClose: () => void
}

export function ArtistPage({ artist, onClose }: ArtistPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const popularTracks = [
    {
      id: 1,
      title: "Blinding Lights",
      plays: "2,847,329,482",
      duration: "3:20",
      album: "After Hours",
      image: "/placeholder.svg?height=40&width=40",
      explicit: false,
    },
    {
      id: 2,
      title: "Save Your Tears",
      plays: "1,923,847,291",
      duration: "3:35",
      album: "After Hours",
      image: "/placeholder.svg?height=40&width=40",
      explicit: false,
    },
    {
      id: 3,
      title: "Starboy",
      plays: "2,134,567,823",
      duration: "3:50",
      album: "Starboy",
      image: "/placeholder.svg?height=40&width=40",
      explicit: true,
    },
    {
      id: 4,
      title: "Can't Feel My Face",
      plays: "1,567,234,891",
      duration: "3:35",
      album: "Beauty Behind the Madness",
      image: "/placeholder.svg?height=40&width=40",
      explicit: false,
    },
    {
      id: 5,
      title: "The Hills",
      plays: "1,789,456,123",
      duration: "4:02",
      album: "Beauty Behind the Madness",
      image: "/placeholder.svg?height=40&width=40",
      explicit: true,
    },
  ]

  const albums = [
    {
      id: 1,
      title: "After Hours",
      year: 2020,
      type: "Album",
      image: "/placeholder.svg?height=200&width=200",
      tracks: 14,
    },
    {
      id: 2,
      title: "Starboy",
      year: 2016,
      type: "Album",
      image: "/placeholder.svg?height=200&width=200",
      tracks: 18,
    },
    {
      id: 3,
      title: "Beauty Behind the Madness",
      year: 2015,
      type: "Album",
      image: "/placeholder.svg?height=200&width=200",
      tracks: 14,
    },
    {
      id: 4,
      title: "Dawn FM",
      year: 2022,
      type: "Album",
      image: "/placeholder.svg?height=200&width=200",
      tracks: 16,
    },
  ]

  const relatedArtists = [
    {
      id: 1,
      name: "Drake",
      image: "/placeholder.svg?height=160&width=160",
      followers: "78.5M",
    },
    {
      id: 2,
      name: "Travis Scott",
      image: "/placeholder.svg?height=160&width=160",
      followers: "52.3M",
    },
    {
      id: 3,
      name: "Post Malone",
      image: "/placeholder.svg?height=160&width=160",
      followers: "65.8M",
    },
    {
      id: 4,
      name: "Future",
      image: "/placeholder.svg?height=160&width=160",
      followers: "41.2M",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        {/* Header */}
        <div className="relative">
          <div className="h-80 bg-gradient-to-b from-purple-600/40 to-gray-900 p-8">
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
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-48 h-48 rounded-full object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-full"></div>
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">Verified Artist</span>
                </div>

                <h1 className="text-6xl font-bold text-white mb-4">{artist.name}</h1>

                <div className="flex items-center space-x-4 text-white">
                  <span className="text-lg">{artist.monthlyListeners} monthly listeners</span>
                  <span>•</span>
                  <span className="text-lg">{artist.genre}</span>
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
                variant={isFollowing ? "outline" : "default"}
                className={`px-8 ${
                  isFollowing
                    ? "border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                    : "bg-transparent border border-gray-600 text-white hover:bg-gray-800"
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
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
              {["overview", "discography", "related"].map((tab) => (
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
              {/* Popular Tracks */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Popular</h2>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Show all
                  </Button>
                </div>

                <div className="space-y-2">
                  {popularTracks.map((track, index) => (
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
                        <p className="text-gray-400 text-sm">{track.plays} plays</p>
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

              {/* Albums */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Albums</h2>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Show all
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {albums.map((album) => (
                    <Card
                      key={album.id}
                      className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                    >
                      <div className="relative mb-4">
                        <img
                          src={album.image || "/placeholder.svg"}
                          alt={album.title}
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
                      <h3 className="text-white font-medium mb-1">{album.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {album.year} • {album.type}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discography" className="space-y-8">
              {/* Albums */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {albums.map((album) => (
                    <Card
                      key={album.id}
                      className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                    >
                      <div className="relative mb-4">
                        <img
                          src={album.image || "/placeholder.svg"}
                          alt={album.title}
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
                      <h3 className="text-white font-medium mb-1">{album.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {album.year} • {album.type}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Singles & EPs */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Singles & EPs</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    {
                      id: 1,
                      title: "Nothing Is Lost (You Give Me Strength)",
                      year: 2022,
                      image: "/placeholder.svg?height=200&width=200",
                    },
                    { id: 2, title: "Call Out My Name", year: 2018, image: "/placeholder.svg?height=200&width=200" },
                    { id: 3, title: "My Dear Melancholy,", year: 2018, image: "/placeholder.svg?height=200&width=200" },
                  ].map((single) => (
                    <Card
                      key={single.id}
                      className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                    >
                      <div className="relative mb-4">
                        <img
                          src={single.image || "/placeholder.svg"}
                          alt={single.title}
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
                      <h3 className="text-white font-medium mb-1">{single.title}</h3>
                      <p className="text-gray-400 text-sm">{single.year} • Single</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="related" className="space-y-8">
              {/* Related Artists */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Fans also like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {relatedArtists.map((relatedArtist) => (
                    <Card
                      key={relatedArtist.id}
                      className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/30 transition-colors cursor-pointer p-4"
                    >
                      <div className="text-center">
                        <div className="relative mb-4">
                          <img
                            src={relatedArtist.image || "/placeholder.svg"}
                            alt={relatedArtist.name}
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
                        <h3 className="text-white font-medium mb-1 truncate">{relatedArtist.name}</h3>
                        <p className="text-gray-400 text-sm">Artist • {relatedArtist.followers} followers</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
