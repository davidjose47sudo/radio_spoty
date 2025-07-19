"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Download, RefreshCw, User, Upload, Play, CreditCard, Settings, Zap } from "lucide-react"
import { getRecentEvents } from "@/lib/events"

export function EventsLog() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await getRecentEvents(200)

      if (error) throw error

      setEvents(data || [])
    } catch (error) {
      console.error("Error loading events:", error)
      // Fallback to mock data for demo
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }

  // Mock events for demo purposes
  const mockEvents = [
    {
      id: "1",
      event_type: "auth",
      action: "user_signin",
      user_id: "user1",
      profiles: { full_name: "John Doe", email: "john@example.com" },
      ip_address: "192.168.1.1",
      country: "United States",
      city: "New York",
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      metadata: { success: true },
    },
    {
      id: "2",
      event_type: "upload",
      action: "song_uploaded",
      user_id: "admin1",
      profiles: { full_name: "Admin User", email: "admin@example.com" },
      resource_type: "song",
      resource_id: "song123",
      ip_address: "10.0.0.1",
      country: "United States",
      city: "San Francisco",
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      metadata: { title: "New Song", artist: "Artist Name", file_size: 5242880 },
    },
    {
      id: "3",
      event_type: "play",
      action: "song_played",
      user_id: "user2",
      profiles: { full_name: "Jane Smith", email: "jane@example.com" },
      resource_type: "song",
      resource_id: "song456",
      ip_address: "203.0.113.1",
      country: "United Kingdom",
      city: "London",
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      metadata: { song_title: "Popular Song", duration_played: 180 },
    },
    {
      id: "4",
      event_type: "subscription",
      action: "subscription_created",
      user_id: "user3",
      profiles: { full_name: "Bob Johnson", email: "bob@example.com" },
      ip_address: "198.51.100.1",
      country: "Canada",
      city: "Toronto",
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      metadata: { plan: "premium", amount: 9.99 },
    },
    {
      id: "5",
      event_type: "admin",
      action: "user_role_changed",
      user_id: "admin1",
      profiles: { full_name: "Admin User", email: "admin@example.com" },
      resource_type: "user",
      resource_id: "user4",
      ip_address: "10.0.0.1",
      country: "United States",
      city: "San Francisco",
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      metadata: { old_role: "free", new_role: "premium", target_user: "alice@example.com" },
    },
  ]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEventType = eventTypeFilter === "all" || event.event_type === eventTypeFilter
    const matchesAction = actionFilter === "all" || event.action === actionFilter

    return matchesSearch && matchesEventType && matchesAction
  })

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "auth":
        return <User className="w-4 h-4" />
      case "upload":
        return <Upload className="w-4 h-4" />
      case "play":
        return <Play className="w-4 h-4" />
      case "subscription":
        return <CreditCard className="w-4 h-4" />
      case "admin":
        return <Settings className="w-4 h-4" />
      case "api":
        return <Zap className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "auth":
        return "bg-blue-500/20 text-blue-400"
      case "upload":
        return "bg-green-500/20 text-green-400"
      case "play":
        return "bg-purple-500/20 text-purple-400"
      case "subscription":
        return "bg-yellow-500/20 text-yellow-400"
      case "admin":
        return "bg-red-500/20 text-red-400"
      case "api":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const formatMetadata = (metadata: any) => {
    if (!metadata) return ""

    const keys = Object.keys(metadata)
    if (keys.length === 0) return ""

    return keys
      .slice(0, 2)
      .map((key) => `${key}: ${metadata[key]}`)
      .join(", ")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Events Log</h2>
          <p className="text-gray-400">Monitor all system activities and user actions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadEvents} className="border-gray-600 text-white bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-gray-600 text-white bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search events, users, actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="play">Playback</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user_signin">Sign In</SelectItem>
                <SelectItem value="user_signup">Sign Up</SelectItem>
                <SelectItem value="song_uploaded">Song Upload</SelectItem>
                <SelectItem value="song_played">Song Play</SelectItem>
                <SelectItem value="subscription_created">Subscription Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Events ({filteredEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading events...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Event</TableHead>
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Details</TableHead>
                  <TableHead className="text-gray-400">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Badge className={getEventTypeColor(event.event_type)}>
                          {getEventIcon(event.event_type)}
                          <span className="ml-1">{event.event_type}</span>
                        </Badge>
                        <span className="text-white font-medium">{event.action.replace(/_/g, " ")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white font-medium">{event.profiles?.full_name || "System"}</div>
                        <div className="text-gray-400 text-sm">{event.profiles?.email || "N/A"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300">
                        {event.city && event.country ? `${event.city}, ${event.country}` : "Unknown"}
                      </div>
                      <div className="text-gray-500 text-sm">{event.ip_address || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300 text-sm max-w-xs truncate">{formatMetadata(event.metadata)}</div>
                      {event.resource_type && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {event.resource_type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400">{formatTimeAgo(event.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
