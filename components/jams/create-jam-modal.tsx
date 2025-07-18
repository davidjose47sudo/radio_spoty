"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Globe, Lock, X, Plus, Search, Play, Heart } from "lucide-react"

interface CreateJamModalProps {
  onClose: () => void
  onCreateJam: (jamData: any) => void
  user: any
}

export function CreateJamModal({ onClose, onCreateJam, user }: CreateJamModalProps) {
  const [step, setStep] = useState(1)
  const [jamData, setJamData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    genre: "",
    maxListeners: 100,
    allowChat: true,
    allowRequests: true,
    moderationLevel: "medium",
    selectedTracks: [],
    invitedFriends: [],
  })

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "R&B",
    "Country",
    "Reggae",
    "Blues",
    "Folk",
    "Indie",
    "Metal",
    "Punk",
    "Alternative",
    "Latin",
    "Chill",
    "Lo-fi",
  ]

  const suggestedTracks = [
    {
      id: 1,
      title: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
      duration: "4:03",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "Strobe",
      artist: "Deadmau5",
      album: "For Lack of a Better Name",
      duration: "10:34",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "Breathe Me",
      artist: "Sia",
      album: "Colour the Small One",
      duration: "4:32",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "Teardrop",
      artist: "Massive Attack",
      album: "Mezzanine",
      duration: "5:30",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const friends = [
    { id: 1, name: "Sarah M.", avatar: "/placeholder.svg?height=32&width=32", online: true },
    { id: 2, name: "Alex R.", avatar: "/placeholder.svg?height=32&width=32", online: true },
    { id: 3, name: "Emma L.", avatar: "/placeholder.svg?height=32&width=32", online: false },
    { id: 4, name: "Marcus J.", avatar: "/placeholder.svg?height=32&width=32", online: true },
    { id: 5, name: "Luna P.", avatar: "/placeholder.svg?height=32&width=32", online: false },
  ]

  const handleGenreSelect = (genre: string) => {
    setJamData((prev) => ({ ...prev, genre }))
  }

  const handleTrackAdd = (track: any) => {
    setJamData((prev) => ({
      ...prev,
      selectedTracks: [...prev.selectedTracks, track],
    }))
  }

  const handleTrackRemove = (trackId: number) => {
    setJamData((prev) => ({
      ...prev,
      selectedTracks: prev.selectedTracks.filter((t) => t.id !== trackId),
    }))
  }

  const handleFriendInvite = (friend: any) => {
    setJamData((prev) => ({
      ...prev,
      invitedFriends: prev.invitedFriends.includes(friend.id)
        ? prev.invitedFriends.filter((id) => id !== friend.id)
        : [...prev.invitedFriends, friend.id],
    }))
  }

  const handleCreateJam = () => {
    onCreateJam(jamData)
    onClose()
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return jamData.name.trim() && jamData.genre
      case 2:
        return jamData.selectedTracks.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Create New Jam</CardTitle>
                <p className="text-gray-400">Step {step} of 3</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            // Step 1: Basic Info
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="jamName" className="text-white">
                      Jam Name *
                    </Label>
                    <Input
                      id="jamName"
                      value={jamData.name}
                      onChange={(e) => setJamData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your jam name..."
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={jamData.description}
                      onChange={(e) => setJamData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your jam..."
                      className="bg-gray-800 border-gray-600 text-white mt-1 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white">Genre *</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                      {genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant={jamData.genre === genre ? "default" : "outline"}
                          className={`cursor-pointer p-2 text-center justify-center transition-all ${
                            jamData.genre === genre
                              ? "bg-green-500 text-black hover:bg-green-600"
                              : "border-gray-600 text-gray-300 hover:bg-gray-800"
                          }`}
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {jamData.isPrivate ? (
                        <Lock className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Globe className="w-5 h-5 text-green-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">{jamData.isPrivate ? "Private Jam" : "Public Jam"}</p>
                        <p className="text-gray-400 text-sm">
                          {jamData.isPrivate ? "Only invited friends can join" : "Anyone can discover and join"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={jamData.isPrivate}
                      onCheckedChange={(checked) => setJamData((prev) => ({ ...prev, isPrivate: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            // Step 2: Music Selection
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Add Music</h3>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for songs, artists, or albums..."
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                {/* Selected Tracks */}
                {jamData.selectedTracks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-3">Selected Tracks ({jamData.selectedTracks.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {jamData.selectedTracks.map((track, index) => (
                        <div key={track.id} className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                          <img src={track.image || "/placeholder.svg"} alt={track.title} className="w-8 h-8 rounded" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{track.title}</p>
                            <p className="text-gray-400 text-xs">{track.artist}</p>
                          </div>
                          <span className="text-gray-400 text-xs">{track.duration}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 text-gray-400 hover:text-white"
                            onClick={() => handleTrackRemove(track.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Tracks */}
                <div>
                  <h4 className="text-white font-medium mb-3">Suggested for You</h4>
                  <div className="space-y-2">
                    {suggestedTracks
                      .filter((track) => !jamData.selectedTracks.find((t) => t.id === track.id))
                      .map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer group"
                        >
                          <img
                            src={track.image || "/placeholder.svg"}
                            alt={track.title}
                            className="w-10 h-10 rounded"
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium">{track.title}</p>
                            <p className="text-gray-400 text-sm">
                              {track.artist} • {track.album}
                            </p>
                          </div>
                          <span className="text-gray-400 text-sm">{track.duration}</span>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white">
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-green-400 hover:text-green-300"
                              onClick={() => handleTrackAdd(track)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            // Step 3: Settings & Invites
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Jam Settings</h3>

                <div className="space-y-4">
                  {/* Max Listeners */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Maximum Listeners</p>
                      <p className="text-gray-400 text-sm">Set the maximum number of people who can join</p>
                    </div>
                    <Input
                      type="number"
                      value={jamData.maxListeners}
                      onChange={(e) =>
                        setJamData((prev) => ({ ...prev, maxListeners: Number.parseInt(e.target.value) || 100 }))
                      }
                      className="w-20 bg-gray-700 border-gray-600 text-white text-center"
                      min="1"
                      max="1000"
                    />
                  </div>

                  {/* Chat Settings */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Enable Chat</p>
                      <p className="text-gray-400 text-sm">Allow listeners to chat during the jam</p>
                    </div>
                    <Switch
                      checked={jamData.allowChat}
                      onCheckedChange={(checked) => setJamData((prev) => ({ ...prev, allowChat: checked }))}
                    />
                  </div>

                  {/* Song Requests */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Allow Song Requests</p>
                      <p className="text-gray-400 text-sm">Let listeners suggest songs to add to the queue</p>
                    </div>
                    <Switch
                      checked={jamData.allowRequests}
                      onCheckedChange={(checked) => setJamData((prev) => ({ ...prev, allowRequests: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Invite Friends */}
              {jamData.isPrivate && (
                <div>
                  <h4 className="text-white font-medium mb-3">Invite Friends</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {friend.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-white text-sm font-medium">{friend.name}</p>
                            {friend.online && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                          </div>
                          <p className="text-gray-400 text-xs">{friend.online ? "Online" : "Offline"}</p>
                        </div>
                        <Button
                          variant={jamData.invitedFriends.includes(friend.id) ? "default" : "outline"}
                          size="sm"
                          className={
                            jamData.invitedFriends.includes(friend.id)
                              ? "bg-green-500 text-black hover:bg-green-600"
                              : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                          }
                          onClick={() => handleFriendInvite(friend)}
                        >
                          {jamData.invitedFriends.includes(friend.id) ? "Invited" : "Invite"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-gray-700" />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            <div className="flex space-x-2">
              {step < 3 ? (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-black font-medium"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-black font-medium"
                  onClick={handleCreateJam}
                  disabled={!canProceed()}
                >
                  Create Jam
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
