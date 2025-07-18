"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  X,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  Music,
  Clock,
  Send,
  MoreHorizontal,
  MessageCircle,
  Share2,
  Crown,
  Radio,
} from "lucide-react"

interface FriendsManagerProps {
  user: any
  onClose: () => void
}

export function FriendsManager({ user, onClose }: FriendsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("friends")

  // Mock data for friends
  const friends = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarah_music",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
      currentTrack: "Blinding Lights - The Weeknd",
      lastActive: "Active now",
      mutualFriends: 12,
      isPremium: true,
      joinedJams: 45,
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "@mike_beats",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
      currentTrack: null,
      lastActive: "2 hours ago",
      mutualFriends: 8,
      isPremium: false,
      joinedJams: 23,
    },
    {
      id: 3,
      name: "Emma Wilson",
      username: "@emma_vibes",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
      currentTrack: "Good 4 U - Olivia Rodrigo",
      lastActive: "Active now",
      mutualFriends: 15,
      isPremium: true,
      joinedJams: 67,
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      username: "@alex_radio",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
      currentTrack: null,
      lastActive: "1 day ago",
      mutualFriends: 5,
      isPremium: false,
      joinedJams: 12,
    },
  ]

  // Mock data for friend requests
  const friendRequests = [
    {
      id: 1,
      name: "Jessica Brown",
      username: "@jess_tunes",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 3,
      requestDate: "2 days ago",
      isPremium: false,
    },
    {
      id: 2,
      name: "David Kim",
      username: "@david_mix",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 7,
      requestDate: "1 week ago",
      isPremium: true,
    },
  ]

  // Mock data for suggested friends
  const suggestions = [
    {
      id: 1,
      name: "Lisa Park",
      username: "@lisa_sounds",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 9,
      reason: "Listens to similar music",
      isPremium: true,
    },
    {
      id: 2,
      name: "Tom Wilson",
      username: "@tom_radio",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 4,
      reason: "In your area",
      isPremium: false,
    },
    {
      id: 3,
      name: "Maya Patel",
      username: "@maya_beats",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualFriends: 11,
      reason: "Joined similar jams",
      isPremium: true,
    },
  ]

  const handleAcceptRequest = (requestId: number) => {
    console.log("Accept friend request:", requestId)
    // Handle accept logic
  }

  const handleDeclineRequest = (requestId: number) => {
    console.log("Decline friend request:", requestId)
    // Handle decline logic
  }

  const handleSendRequest = (userId: number) => {
    console.log("Send friend request to:", userId)
    // Handle send request logic
  }

  const handleRemoveFriend = (friendId: number) => {
    console.log("Remove friend:", friendId)
    // Handle remove friend logic
  }

  const handleStartJam = (friendId: number) => {
    console.log("Start jam with friend:", friendId)
    // Handle start jam logic
  }

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Friends & Family</CardTitle>
                <p className="text-gray-400">Connect with friends and discover music together</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search friends or add by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="friends" className="text-white">
                Friends ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="requests" className="text-white">
                Requests ({friendRequests.length})
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="text-white">
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="family" className="text-white">
                Family Plan
              </TabsTrigger>
            </TabsList>

            {/* Friends Tab */}
            <TabsContent value="friends" className="space-y-4 mt-6">
              {filteredFriends.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No friends found</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {searchQuery ? "Try a different search term" : "Start connecting with friends to see them here"}
                    </p>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => setSelectedTab("suggestions")}
                    >
                      Find Friends
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFriends.map((friend) => (
                    <Card key={friend.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                <AvatarFallback className="bg-gray-700 text-white">
                                  {friend.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {friend.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-medium">{friend.name}</h3>
                                {friend.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                              </div>
                              <p className="text-gray-400 text-sm">{friend.username}</p>
                              <p className="text-gray-500 text-xs">{friend.mutualFriends} mutual friends</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Current Activity */}
                        {friend.currentTrack ? (
                          <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Music className="w-4 h-4 text-green-400" />
                              <p className="text-green-300 text-sm font-medium">Currently listening</p>
                            </div>
                            <p className="text-white text-sm mt-1">{friend.currentTrack}</p>
                          </div>
                        ) : (
                          <div className="mb-3 p-2 bg-gray-700/50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-400 text-sm">{friend.lastActive}</p>
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <span>{friend.joinedJams} jams joined</span>
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            Friends since 2023
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => handleStartJam(friend.id)}
                          >
                            <Radio className="w-4 h-4 mr-1" />
                            Start Jam
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Friend Requests Tab */}
            <TabsContent value="requests" className="space-y-4 mt-6">
              {friendRequests.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No pending requests</h3>
                    <p className="text-gray-400 text-sm">Friend requests will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <Card key={request.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                              <AvatarFallback className="bg-gray-700 text-white">
                                {request.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-medium">{request.name}</h3>
                                {request.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                              </div>
                              <p className="text-gray-400 text-sm">{request.username}</p>
                              <p className="text-gray-500 text-xs">
                                {request.mutualFriends} mutual friends • {request.requestDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={suggestion.avatar || "/placeholder.svg"} alt={suggestion.name} />
                            <AvatarFallback className="bg-gray-700 text-white">
                              {suggestion.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-white font-medium">{suggestion.name}</h3>
                              {suggestion.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <p className="text-gray-400 text-sm">{suggestion.username}</p>
                            <p className="text-gray-500 text-xs">{suggestion.mutualFriends} mutual friends</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                          {suggestion.reason}
                        </Badge>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleSendRequest(suggestion.id)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send Request
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Family Plan Tab */}
            <TabsContent value="family" className="space-y-6 mt-6">
              {user?.plan === "family" ? (
                <div className="space-y-6">
                  {/* Family Plan Status */}
                  <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Family Plan Active</h3>
                            <p className="text-purple-200 text-sm">4 of 6 members added</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                        >
                          Manage Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Family Members */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Family Members</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Plan Owner */}
                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-purple-500 text-white">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{user.name} (You)</p>
                            <p className="text-gray-400 text-sm">Plan Owner</p>
                          </div>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300">Owner</Badge>
                      </div>

                      {/* Add more family members UI */}
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <UserPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm mb-3">Invite family members</p>
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white">Send Invitation</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Family Plan Not Active</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Upgrade to Family Plan to share premium features with up to 6 family members
                    </p>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Family
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
