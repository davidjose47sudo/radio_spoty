"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Music,
  Radio,
  TrendingUp,
  Upload,
  Settings,
  BarChart3,
  Activity,
  Crown,
  Database,
  Zap,
  AlertCircle,
} from "lucide-react"

// Import admin components
import { SongManager } from "./song-manager"
import { ArtistManager } from "./artist-manager"
import { GenreManager } from "./genre-manager"
import { RadioStationManager } from "./radio-station-manager"
import { UserManager } from "./user-manager"
import { SubscriptionManager } from "./subscription-manager"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { AIRadioGenerator } from "./ai-radio-generator"
import { FileUploadManager } from "./file-upload-manager"

interface AdminDashboardProps {
  onClose: () => void
}

interface DashboardStats {
  total_users: number
  total_songs: number
  total_artists: number
  total_stations: number
  total_plays_today: number
  premium_users: number
  storage_used_mb: number
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      // This would call your Supabase function
      // const { data } = await supabase.rpc('get_admin_dashboard_stats')
      // For now, using mock data
      setStats({
        total_users: 15420,
        total_songs: 8934,
        total_artists: 2156,
        total_stations: 342,
        total_plays_today: 45678,
        premium_users: 3421,
        storage_used_mb: 125.6,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your AuraRadio platform</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-10 w-full bg-gray-800">
                <TabsTrigger value="overview" className="text-xs">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="songs" className="text-xs">
                  <Music className="w-4 h-4 mr-1" />
                  Songs
                </TabsTrigger>
                <TabsTrigger value="artists" className="text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  Artists
                </TabsTrigger>
                <TabsTrigger value="genres" className="text-xs">
                  <Activity className="w-4 h-4 mr-1" />
                  Genres
                </TabsTrigger>
                <TabsTrigger value="stations" className="text-xs">
                  <Radio className="w-4 h-4 mr-1" />
                  Stations
                </TabsTrigger>
                <TabsTrigger value="users" className="text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="text-xs">
                  <Crown className="w-4 h-4 mr-1" />
                  Plans
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">
                  <Zap className="w-4 h-4 mr-1" />
                  AI Radio
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {loading ? "..." : formatNumber(stats?.total_users || 0)}
                        </div>
                        <p className="text-xs text-green-400">+12% from last month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Songs</CardTitle>
                        <Music className="h-4 w-4 text-green-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {loading ? "..." : formatNumber(stats?.total_songs || 0)}
                        </div>
                        <p className="text-xs text-green-400">+8% from last month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Premium Users</CardTitle>
                        <Crown className="h-4 w-4 text-yellow-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {loading ? "..." : formatNumber(stats?.premium_users || 0)}
                        </div>
                        <p className="text-xs text-green-400">+15% from last month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Plays Today</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {loading ? "..." : formatNumber(stats?.total_plays_today || 0)}
                        </div>
                        <p className="text-xs text-green-400">+5% from yesterday</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center">
                          <Database className="w-5 h-5 mr-2 text-blue-400" />
                          Storage Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white mb-2">
                          {loading ? "..." : `${stats?.storage_used_mb?.toFixed(1) || 0} GB`}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">45% of 1TB limit</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center">
                          <Radio className="w-5 h-5 mr-2 text-green-400" />
                          Active Stations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-white mb-2">
                          {loading ? "..." : stats?.total_stations || 0}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            AI Generated: 156
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                          System Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">API Status</span>
                            <Badge className="bg-green-500 text-white">Healthy</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Database</span>
                            <Badge className="bg-green-500 text-white">Online</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Storage</span>
                            <Badge className="bg-green-500 text-white">Available</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300">New user registered: john.doe@example.com</span>
                          <span className="text-gray-500 text-sm">2 minutes ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-300">Song uploaded: "Summer Vibes" by DJ Alex</span>
                          <span className="text-gray-500 text-sm">5 minutes ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-300">AI Radio generated: "Chill Evening Mix"</span>
                          <span className="text-gray-500 text-sm">8 minutes ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300">Premium subscription activated</span>
                          <span className="text-gray-500 text-sm">12 minutes ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="songs" className="mt-0">
                <SongManager />
              </TabsContent>

              <TabsContent value="artists" className="mt-0">
                <ArtistManager />
              </TabsContent>

              <TabsContent value="genres" className="mt-0">
                <GenreManager />
              </TabsContent>

              <TabsContent value="stations" className="mt-0">
                <RadioStationManager />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UserManager />
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-0">
                <SubscriptionManager />
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <FileUploadManager />
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <AIRadioGenerator />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <AnalyticsDashboard />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
