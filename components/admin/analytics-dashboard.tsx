"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Music, Radio, Play, Download, Calendar, Globe, Smartphone } from "lucide-react"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(false)

  // Mock data - in real app, this would come from your analytics service
  const [analytics, setAnalytics] = useState({
    overview: {
      total_plays: 1234567,
      unique_listeners: 45678,
      total_listening_time: 987654,
      avg_session_duration: 23.5,
    },
    trends: {
      plays_trend: [120, 135, 142, 158, 167, 189, 201],
      users_trend: [45, 52, 48, 61, 67, 73, 78],
      revenue_trend: [1200, 1350, 1280, 1450, 1520, 1680, 1750],
    },
    top_content: {
      songs: [
        { title: "Blinding Lights", artist: "The Weeknd", plays: 45678 },
        { title: "Shape of You", artist: "Ed Sheeran", plays: 42341 },
        { title: "Someone Like You", artist: "Adele", plays: 38902 },
      ],
      artists: [
        { name: "The Weeknd", plays: 156789 },
        { name: "Ed Sheeran", plays: 134567 },
        { name: "Adele", plays: 123456 },
      ],
      stations: [
        { name: "Chill Vibes", plays: 78901 },
        { name: "Workout Energy", plays: 67890 },
        { name: "Jazz Lounge", plays: 56789 },
      ],
    },
    demographics: {
      age_groups: [
        { range: "18-24", percentage: 28 },
        { range: "25-34", percentage: 35 },
        { range: "35-44", percentage: 22 },
        { range: "45-54", percentage: 12 },
        { range: "55+", percentage: 3 },
      ],
      countries: [
        { name: "United States", percentage: 45 },
        { name: "United Kingdom", percentage: 18 },
        { name: "Canada", percentage: 12 },
        { name: "Australia", percentage: 8 },
        { name: "Germany", percentage: 7 },
        { name: "Others", percentage: 10 },
      ],
      devices: [
        { type: "Mobile", percentage: 68 },
        { type: "Desktop", percentage: 24 },
        { type: "Tablet", percentage: 8 },
      ],
    },
  })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-600 text-white bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Plays</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.total_plays)}</p>
                  </div>
                  <Play className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-xs text-green-400 mt-1">+12% from last period</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Unique Listeners</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.unique_listeners)}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-xs text-green-400 mt-1">+8% from last period</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Listening Time</p>
                    <p className="text-2xl font-bold text-white">
                      {formatDuration(analytics.overview.total_listening_time)}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-xs text-green-400 mt-1">+15% from last period</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Session</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.avg_session_duration}m</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-xs text-red-400 mt-1">-2% from last period</p>
              </CardContent>
            </Card>
          </div>

          {/* Trends Chart Placeholder */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Interactive charts would be displayed here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Real-time Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white">New user registered</span>
                  </div>
                  <span className="text-gray-400 text-sm">2 seconds ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-white">Song played: "Blinding Lights"</span>
                  </div>
                  <span className="text-gray-400 text-sm">5 seconds ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-white">AI radio generated</span>
                  </div>
                  <span className="text-gray-400 text-sm">12 seconds ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Top Songs */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Top Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.top_content.songs.map((song, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{song.title}</div>
                        <div className="text-gray-400 text-sm">{song.artist}</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {formatNumber(song.plays)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Artists */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Top Artists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.top_content.artists.map((artist, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-white font-medium">{artist.name}</div>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {formatNumber(artist.plays)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Stations */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Radio className="w-5 h-5 mr-2" />
                  Top Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.top_content.stations.map((station, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-white font-medium">{station.name}</div>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        {formatNumber(station.plays)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Age Demographics */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Age Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.demographics.age_groups.map((group, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{group.range}</span>
                        <span className="text-white">{group.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${group.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.demographics.countries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{country.name}</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {country.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.demographics.devices.map((device, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{device.type}</span>
                        <span className="text-white">{device.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-400 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Premium Subscriptions</span>
                    <span className="text-white font-medium">$12,450</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Family Plans</span>
                    <span className="text-white font-medium">$8,320</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Ad Revenue</span>
                    <span className="text-white font-medium">$2,180</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Monthly Recurring Revenue</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$22,950</div>
                      <div className="text-green-400 text-sm">+15.2%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average Revenue Per User</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$4.85</div>
                      <div className="text-green-400 text-sm">+8.1%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Customer Lifetime Value</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$127.30</div>
                      <div className="text-green-400 text-sm">+12.4%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
