"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Radio, Search, Edit, Trash2, Eye, Zap, TrendingUp } from "lucide-react"
import { supabase, type RadioStation } from "@/lib/supabase"

export function RadioStationManager() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("radio_stations")
        .select(`
          *,
          radio_station_songs (
            songs (
              id,
              title,
              song_artists (
                artists (name)
              )
            )
          ),
          profiles (
            full_name,
            email
          )
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform data to include song count and creator info
      const transformedStations = data.map((station) => ({
        ...station,
        song_count: station.radio_station_songs?.length || 0,
        songs: station.radio_station_songs?.map((rss: any) => rss.songs) || [],
        creator: station.profiles,
      }))

      setStations(transformedStations)
    } catch (error) {
      console.error("Error loading stations:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStationStatus = async (stationId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("radio_stations").update({ is_active: isActive }).eq("id", stationId)

      if (error) throw error

      setStations(stations.map((station) => (station.id === stationId ? { ...station, is_active: isActive } : station)))
    } catch (error) {
      console.error("Error updating station status:", error)
    }
  }

  const deleteStation = async (stationId: string) => {
    if (!confirm("Are you sure you want to delete this radio station?")) return

    try {
      const { error } = await supabase
        .from("radio_stations")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", stationId)

      if (error) throw error

      setStations(stations.filter((station) => station.id !== stationId))
    } catch (error) {
      console.error("Error deleting station:", error)
    }
  }

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      filterType === "all" ||
      (filterType === "ai" && station.is_ai_generated) ||
      (filterType === "manual" && !station.is_ai_generated)

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && station.is_active) ||
      (filterStatus === "inactive" && !station.is_active)

    return matchesSearch && matchesType && matchesStatus
  })

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M"
    if (count >= 1000) return (count / 1000).toFixed(1) + "K"
    return count.toString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Radio Station Management</h2>
          <p className="text-gray-400">Manage all radio stations on your platform</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-600 text-white bg-transparent">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Radio className="w-4 h-4 mr-2" />
            Create Station
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
                  placeholder="Search stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ai">AI Generated</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stations Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Radio className="w-5 h-5 mr-2" />
            Radio Stations ({filteredStations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading stations...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Station</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Songs</TableHead>
                  <TableHead className="text-gray-400">Plays</TableHead>
                  <TableHead className="text-gray-400">Creator</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStations.map((station) => (
                  <TableRow key={station.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Radio className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{station.name}</div>
                          {station.description && (
                            <div className="text-gray-400 text-sm truncate max-w-xs">{station.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {station.is_ai_generated ? (
                        <Badge className="bg-purple-500/20 text-purple-400">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
                          Manual
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {station.song_count} songs
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatPlayCount(station.play_count)}</TableCell>
                    <TableCell>
                      <div className="text-gray-300">{station.creator?.full_name || "System"}</div>
                      <div className="text-gray-500 text-sm">{new Date(station.created_at).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={station.is_active}
                          onCheckedChange={(checked) => toggleStationStatus(station.id, checked)}
                        />
                        <span className={`text-sm ${station.is_active ? "text-green-400" : "text-gray-400"}`}>
                          {station.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteStation(station.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
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
