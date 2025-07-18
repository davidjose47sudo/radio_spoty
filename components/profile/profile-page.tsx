"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Crown,
  Music,
  Clock,
  Heart,
  Share2,
  Edit,
  Camera,
  Calendar,
  MapPin,
  Headphones,
  TrendingUp,
  Users,
} from "lucide-react"

interface ProfilePageProps {
  user: any
  onClose: () => void
  onLogout: () => void
}

export function ProfilePage({ user, onClose, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    location: "New York, USA",
    bio: "Music lover and AI radio enthusiast",
  })

  const stats = {
    listeningTime: "127h",
    favoriteStations: 23,
    jamsJoined: 45,
    songsDiscovered: 1247,
  }

  const recentActivity = [
    { type: "station", name: "Morning Energy Mix", time: "2 hours ago" },
    { type: "jam", name: "Weekend Vibes Jam", time: "5 hours ago" },
    { type: "favorite", name: "Jazz Lounge", time: "1 day ago" },
    { type: "discovery", name: "New Artist: Luna Park", time: "2 days ago" },
  ]

  const topGenres = [
    { name: "Electronic", percentage: 35 },
    { name: "Pop", percentage: 28 },
    { name: "Jazz", percentage: 20 },
    { name: "Rock", percentage: 17 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Profile Header */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="bg-green-500 text-black text-2xl font-bold">
                  {editData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 hover:bg-green-600 text-black rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{editData.name}</h1>
                <Badge className="bg-green-500/20 text-green-300">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <p className="text-gray-400 mb-3">{editData.bio}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{editData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined March 2024</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="overview" className="text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-white">
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-white">
                Settings
              </TabsTrigger>
              <TabsTrigger value="subscription" className="text-white">
                Subscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.listeningTime}</p>
                    <p className="text-sm text-gray-400">Listening Time</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.favoriteStations}</p>
                    <p className="text-sm text-gray-400">Favorite Stations</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.jamsJoined}</p>
                    <p className="text-sm text-gray-400">Jams Joined</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.songsDiscovered}</p>
                    <p className="text-sm text-gray-400">Songs Discovered</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Genres */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Top Genres
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topGenres.map((genre) => (
                    <div key={genre.name} className="flex items-center justify-between">
                      <span className="text-white">{genre.name}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${genre.percentage}%` }} />
                        </div>
                        <span className="text-gray-400 text-sm w-10">{genre.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        {activity.type === "station" && <Headphones className="w-5 h-5 text-green-400" />}
                        {activity.type === "jam" && <Users className="w-5 h-5 text-blue-400" />}
                        {activity.type === "favorite" && <Heart className="w-5 h-5 text-red-400" />}
                        {activity.type === "discovery" && <TrendingUp className="w-5 h-5 text-yellow-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.name}</p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {isEditing ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-white">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-white">
                        Bio
                      </Label>
                      <Input
                        id="bio"
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="bg-green-500 hover:bg-green-600 text-black">Save Changes</Button>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Privacy Settings</p>
                        <p className="text-gray-400 text-sm">Manage who can see your activity</p>
                      </div>
                      <Button variant="ghost" className="text-green-400 hover:text-green-300">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Notifications</p>
                        <p className="text-gray-400 text-sm">Control your notification preferences</p>
                      </div>
                      <Button variant="ghost" className="text-green-400 hover:text-green-300">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Connected Apps</p>
                        <p className="text-gray-400 text-sm">Manage third-party integrations</p>
                      </div>
                      <Button variant="ghost" className="text-green-400 hover:text-green-300">
                        View
                      </Button>
                    </div>
                    <Separator className="bg-gray-700" />
                    <Button
                      variant="outline"
                      className="w-full border-red-600 text-red-400 hover:bg-red-600/20 bg-transparent"
                      onClick={onLogout}
                    >
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <Card className="bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-green-400" />
                    {user.plan === "premium"
                      ? "Premium Subscription"
                      : user.plan === "family"
                        ? "Family Subscription"
                        : "Free Plan"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">
                        {user.plan === "premium"
                          ? "AuraRadio Premium"
                          : user.plan === "family"
                            ? "AuraRadio Family"
                            : "AuraRadio Free"}
                      </p>
                      <p className="text-green-200 text-sm">
                        {user.plan !== "free" ? "Active until March 15, 2025" : "Current plan"}
                      </p>
                    </div>
                    <Badge className={user.plan !== "free" ? "bg-green-500 text-black" : "bg-gray-500 text-white"}>
                      {user.plan !== "free" ? "Active" : "Free"}
                    </Badge>
                  </div>

                  {user.plan !== "free" ? (
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-green-200 text-sm">✓ Unlimited skips and replays</div>
                      <div className="flex items-center text-green-200 text-sm">✓ High-quality audio streaming</div>
                      <div className="flex items-center text-green-200 text-sm">✓ AI-powered recommendations</div>
                      <div className="flex items-center text-green-200 text-sm">✓ Create unlimited Jams</div>
                      {user.plan === "family" && (
                        <div className="flex items-center text-green-200 text-sm">✓ Up to 6 family accounts</div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-300 text-sm">• Limited skips (6 per hour)</div>
                      <div className="flex items-center text-gray-300 text-sm">• Ads between songs</div>
                      <div className="flex items-center text-gray-300 text-sm">• Basic features only</div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-400 hover:bg-green-500/20 bg-transparent"
                      onClick={() => {
                        onClose()
                        // Trigger subscription modal
                        setTimeout(() => {
                          const event = new CustomEvent("showSubscription")
                          window.dispatchEvent(event)
                        }, 100)
                      }}
                    >
                      {user.plan === "free" ? "Upgrade Plan" : "Change Plan"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                      onClick={() => {
                        // Show billing history
                        alert(
                          "Billing History:\n\n" +
                            "• Jan 15, 2024 - $9.99 (Premium)\n" +
                            "• Dec 15, 2023 - $9.99 (Premium)\n" +
                            "• Nov 15, 2023 - $9.99 (Premium)\n" +
                            "• Oct 15, 2023 - $9.99 (Premium)",
                        )
                      }}
                    >
                      Billing History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
