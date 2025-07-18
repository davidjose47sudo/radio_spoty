"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  Search,
  Music,
  Globe,
  Lock,
  Play,
  Volume2,
  MessageCircle,
  Heart,
  Share2,
  Settings,
  Crown,
} from "lucide-react"
import { CreateJamModal } from "./create-jam-modal"

interface JamsPageProps {
  onClose: () => void
}

export function JamsPage({ onClose }: JamsPageProps) {
  const [activeJam, setActiveJam] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateJam, setShowCreateJam] = useState(false)

  const liveJams = [
    {
      id: 1,
      name: "Weekend Vibes 🌅",
      host: "Sarah M.",
      listeners: 47,
      genre: "Chill/Electronic",
      isPrivate: false,
      currentSong: "Midnight City - M83",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Late Night Jazz Session",
      host: "Marcus J.",
      listeners: 23,
      genre: "Jazz",
      isPrivate: false,
      currentSong: "Take Five - Dave Brubeck",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Workout Energy 💪",
      host: "Alex R.",
      listeners: 89,
      genre: "Electronic/Hip Hop",
      isPrivate: false,
      currentSong: "Stronger - Kanye West",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Study Focus Group",
      host: "Emma L.",
      listeners: 156,
      genre: "Lo-fi/Ambient",
      isPrivate: true,
      currentSong: "Lofi Hip Hop Beat",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const myJams = [
    {
      id: 5,
      name: "My Chill Corner",
      listeners: 12,
      genre: "Indie/Alternative",
      isActive: true,
      lastActive: "2 hours ago",
    },
    {
      id: 6,
      name: "Rock Classics",
      listeners: 0,
      genre: "Rock/Classic Rock",
      isActive: false,
      lastActive: "3 days ago",
    },
  ]

  const joinJam = (jam) => {
    setActiveJam(jam)
  }

  const leaveJam = () => {
    setActiveJam(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Jams</CardTitle>
                <p className="text-gray-400">Listen together with friends</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="bg-green-500 hover:bg-green-600 text-black font-medium"
                onClick={() => setShowCreateJam(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Jam
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {activeJam ? (
            // Active Jam View
            <div className="space-y-6">
              {/* Jam Header */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={activeJam.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {activeJam.host
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeJam.name}</h2>
                    <p className="text-purple-200">Hosted by {activeJam.host}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-purple-500/20 text-purple-300">
                    <Users className="w-3 h-3 mr-1" />
                    {activeJam.listeners} listening
                  </Badge>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                    onClick={leaveJam}
                  >
                    Leave Jam
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Player */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Current Track */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{activeJam.currentSong}</h3>
                          <p className="text-gray-400">{activeJam.genre}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                              LIVE
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Heart className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Player Controls */}
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <Button size="icon" className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-200">
                          <Play className="w-6 h-6" />
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-gray-400" />
                          <div className="w-20 h-1 bg-gray-700 rounded-full">
                            <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">2:15</span>
                        <div className="flex-1 h-1 bg-gray-700 rounded-full">
                          <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-400">4:32</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Queue */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Up Next</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { title: "Strobe", artist: "Deadmau5", addedBy: "Alex R." },
                        { title: "Breathe Me", artist: "Sia", addedBy: "Sarah M." },
                        { title: "Teardrop", artist: "Massive Attack", addedBy: "Marcus J." },
                      ].map((track, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-700/50 rounded">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded flex items-center justify-center text-xs text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{track.title}</p>
                            <p className="text-gray-400 text-sm">{track.artist}</p>
                          </div>
                          <p className="text-gray-400 text-xs">Added by {track.addedBy}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Chat & Listeners */}
                <div className="space-y-6">
                  {/* Listeners */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Listeners ({activeJam.listeners})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-green-500 text-white text-xs">U{index + 1}</AvatarFallback>
                          </Avatar>
                          <span className="text-white text-sm">User {index + 1}</span>
                          {index === 0 && <Crown className="w-3 h-3 text-yellow-400" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Chat */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="h-60 overflow-y-auto space-y-2">
                        {[
                          { user: "Sarah M.", message: "Great track choice! 🎵", time: "2:15" },
                          { user: "Alex R.", message: "This is my favorite song", time: "2:12" },
                          { user: "Marcus J.", message: "Anyone know the artist?", time: "2:10" },
                          { user: "Emma L.", message: "Perfect for studying", time: "2:08" },
                        ].map((chat, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-400 font-medium">{chat.user}</span>
                              <span className="text-gray-500 text-xs">{chat.time}</span>
                            </div>
                            <p className="text-gray-300">{chat.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input placeholder="Type a message..." className="bg-gray-700 border-gray-600 text-white" />
                        <Button size="icon" className="bg-green-500 hover:bg-green-600 text-black">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            // Jams Browser
            <Tabs defaultValue="discover" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="discover" className="text-white">
                  Discover
                </TabsTrigger>
                <TabsTrigger value="my-jams" className="text-white">
                  My Jams
                </TabsTrigger>
                <TabsTrigger value="friends" className="text-white">
                  Friends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search jams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                {/* Live Jams */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Live Jams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveJams.map((jam) => (
                      <Card
                        key={jam.id}
                        className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={jam.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-purple-500 text-white">
                                  {jam.host
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-white font-medium flex items-center space-x-2">
                                  <span>{jam.name}</span>
                                  {jam.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                </h4>
                                <p className="text-gray-400 text-sm">by {jam.host}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-500/20 text-green-300">
                              <Users className="w-3 h-3 mr-1" />
                              {jam.listeners}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <p className="text-white text-sm mb-1">Now Playing:</p>
                            <p className="text-gray-300 font-medium">{jam.currentSong}</p>
                            <p className="text-gray-400 text-sm">{jam.genre}</p>
                          </div>

                          <Button
                            className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
                            onClick={() => joinJam(jam)}
                          >
                            Join Jam
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="my-jams" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">My Jams</h3>
                  <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Jam
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myJams.map((jam) => (
                    <Card key={jam.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{jam.name}</h4>
                          <div className="flex items-center space-x-2">
                            {jam.isActive && (
                              <Badge className="bg-green-500/20 text-green-300">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                Live
                              </Badge>
                            )}
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-400 text-sm">{jam.genre}</p>
                          <p className="text-gray-400 text-sm">
                            {jam.isActive ? `${jam.listeners} listening now` : `Last active ${jam.lastActive}`}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            className="flex-1 bg-green-500 hover:bg-green-600 text-black font-medium"
                            onClick={() =>
                              joinJam({
                                ...jam,
                                host: "You",
                                avatar: "/placeholder.svg?height=40&width=40",
                                currentSong: "Your Playlist",
                              })
                            }
                          >
                            {jam.isActive ? "Join" : "Start"}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                          >
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="friends" className="space-y-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Connect with Friends</h3>
                  <p className="text-gray-400 mb-6">Find and follow friends to see their jams and listening activity</p>
                  <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">Find Friends</Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      {showCreateJam && (
        <CreateJamModal
          onClose={() => setShowCreateJam(false)}
          onCreateJam={(jamData) => {
            console.log("New jam created:", jamData)
            // Aquí puedes manejar la creación del jam
          }}
          user={{ name: "Current User" }} // Pasar el usuario actual
        />
      )}
    </div>
  )
}
