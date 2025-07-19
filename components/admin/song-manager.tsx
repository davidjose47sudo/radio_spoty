"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Music, Search, Edit, Trash2, Play, Pause, Download } from "lucide-react"
import { supabase, type Song } from "@/lib/supabase"

export function SongManager() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [playingSong, setPlayingSong] = useState<string | null>(null)

  useEffect(() => {
    loadSongs()
  }, [])

  const loadSongs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("songs")
        .select(`
          *,
          song_artists (
            artists (
              id,
              name
            )
          ),
          song_genres (
            genres (
              id,
              name,
              color
            )
          )
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform the data to include artists and genres arrays
      const transformedSongs = data.map((song) => ({
        ...song,
        artists: song.song_artists?.map((sa: any) => sa.artists) || [],
        genres: song.song_genres?.map((sg: any) => sg.genres) || [],
      }))

      setSongs(transformedSongs)
    } catch (error) {
      console.error("Error loading songs:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSong = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return

    try {
      const { error } = await supabase.from("songs").update({ deleted_at: new Date().toISOString() }).eq("id", songId)

      if (error) throw error

      setSongs(songs.filter((song) => song.id !== songId))
    } catch (error) {
      console.error("Error deleting song:", error)
    }
  }

  const togglePlaySong = (songId: string, url?: string) => {
    if (!url) return

    if (playingSong === songId) {
      setPlayingSong(null)
      // Pause audio logic here
    } else {
      setPlayingSong(songId)
      // Play audio logic here
    }
  }

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artists?.some((artist) => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesGenre = selectedGenre === "all" || song.genres?.some((genre) => genre.name === selectedGenre)

    const matchesStatus = selectedStatus === "all" || song.status === selectedStatus

    return matchesSearch && matchesGenre && matchesStatus
  })

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500/20 text-green-400"
      case "processing":
        return "bg-yellow-500/20 text-yellow-400"
      case "uploading":
        return "bg-blue-500/20 text-blue-400"
      case "error":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Song Management</h2>
          <p className="text-gray-400">Manage all songs in your platform</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-600 text-white bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Music className="w-4 h-4 mr-2" />
            Add Song
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
                  placeholder="Search songs, artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                <SelectItem value="Electronic">Electronic</SelectItem>
                <SelectItem value="Jazz">Jazz</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="uploading">Uploading</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Songs Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Songs ({filteredSongs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading songs...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Song</TableHead>
                  <TableHead className="text-gray-400">Artists</TableHead>
                  <TableHead className="text-gray-400">Genres</TableHead>
                  <TableHead className="text-gray-400">Duration</TableHead>
                  <TableHead className="text-gray-400">Size</TableHead>
                  <TableHead className="text-gray-400">Plays</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSongs.map((song) => (
                  <TableRow key={song.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Music className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{song.title}</div>
                          <div className="text-gray-400 text-sm">{song.file_format}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {song.artists?.map((artist) => (
                          <Badge key={artist.id} variant="secondary" className="bg-blue-500/20 text-blue-400">
                            {artist.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {song.genres?.map((genre) => (
                          <Badge
                            key={genre.id}
                            variant="secondary"
                            className="text-white"
                            style={{ backgroundColor: genre.color + "40" }}
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatDuration(song.duration)}</TableCell>
                    <TableCell className="text-gray-300">{formatFileSize(song.file_size)}</TableCell>
                    <TableCell className="text-gray-300">{song.play_count.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(song.status)}>{song.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {song.file_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePlaySong(song.id, song.file_url)}
                            className="text-gray-400 hover:text-white"
                          >
                            {playingSong === song.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingSong(song)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSong(song.id)}
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

      {/* Edit Song Dialog */}
      {editingSong && (
        <Dialog open={!!editingSong} onOpenChange={() => setEditingSong(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Song</DialogTitle>
              <DialogDescription>Update song information and metadata.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingSong.title}
                  onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex space-x-4">
                <Button className="bg-green-500 hover:bg-green-600">Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingSong(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
