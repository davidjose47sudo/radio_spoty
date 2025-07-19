"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Search, Edit, Trash2, Plus } from "lucide-react"
import { supabase, type Artist } from "@/lib/supabase"

export function ArtistManager() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newArtist, setNewArtist] = useState({
    name: "",
    bio: "",
    image_url: "",
    spotify_id: "",
    apple_music_id: "",
  })

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("artists")
        .select(`
          *,
          song_artists (
            songs (
              id,
              title
            )
          )
        `)
        .is("deleted_at", null)
        .order("name", { ascending: true })

      if (error) throw error

      // Transform data to include song count
      const transformedArtists = data.map((artist) => ({
        ...artist,
        song_count: artist.song_artists?.length || 0,
      }))

      setArtists(transformedArtists)
    } catch (error) {
      console.error("Error loading artists:", error)
    } finally {
      setLoading(false)
    }
  }

  const createArtist = async () => {
    try {
      const { data, error } = await supabase.from("artists").insert([newArtist]).select().single()

      if (error) throw error

      setArtists([...artists, { ...data, song_count: 0 }])
      setNewArtist({ name: "", bio: "", image_url: "", spotify_id: "", apple_music_id: "" })
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Error creating artist:", error)
    }
  }

  const updateArtist = async () => {
    if (!editingArtist) return

    try {
      const { data, error } = await supabase
        .from("artists")
        .update({
          name: editingArtist.name,
          bio: editingArtist.bio,
          image_url: editingArtist.image_url,
          spotify_id: editingArtist.spotify_id,
          apple_music_id: editingArtist.apple_music_id,
        })
        .eq("id", editingArtist.id)
        .select()
        .single()

      if (error) throw error

      setArtists(
        artists.map((artist) => (artist.id === editingArtist.id ? { ...data, song_count: artist.song_count } : artist)),
      )
      setEditingArtist(null)
    } catch (error) {
      console.error("Error updating artist:", error)
    }
  }

  const deleteArtist = async (artistId: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return

    try {
      const { error } = await supabase
        .from("artists")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", artistId)

      if (error) throw error

      setArtists(artists.filter((artist) => artist.id !== artistId))
    } catch (error) {
      console.error("Error deleting artist:", error)
    }
  }

  const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Artist Management</h2>
          <p className="text-gray-400">Manage all artists in your platform</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Artists Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Artists ({filteredArtists.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading artists...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Artist</TableHead>
                  <TableHead className="text-gray-400">Songs</TableHead>
                  <TableHead className="text-gray-400">External IDs</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.map((artist) => (
                  <TableRow key={artist.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                          {artist.image_url ? (
                            <img
                              src={artist.image_url || "/placeholder.svg"}
                              alt={artist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{artist.name}</div>
                          {artist.bio && <div className="text-gray-400 text-sm truncate max-w-xs">{artist.bio}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {artist.song_count} songs
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {artist.spotify_id && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Spotify
                          </Badge>
                        )}
                        {artist.apple_music_id && (
                          <Badge variant="outline" className="text-gray-400 border-gray-400">
                            Apple Music
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{new Date(artist.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingArtist(artist)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteArtist(artist.id)}
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

      {/* Create Artist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Artist</DialogTitle>
            <DialogDescription>Create a new artist profile.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Artist Name *</Label>
              <Input
                id="name"
                value={newArtist.name}
                onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter artist name"
              />
            </div>
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={newArtist.bio}
                onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter artist biography"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={newArtist.image_url}
                onChange={(e) => setNewArtist({ ...newArtist, image_url: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spotify_id">Spotify ID</Label>
                <Input
                  id="spotify_id"
                  value={newArtist.spotify_id}
                  onChange={(e) => setNewArtist({ ...newArtist, spotify_id: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Spotify artist ID"
                />
              </div>
              <div>
                <Label htmlFor="apple_music_id">Apple Music ID</Label>
                <Input
                  id="apple_music_id"
                  value={newArtist.apple_music_id}
                  onChange={(e) => setNewArtist({ ...newArtist, apple_music_id: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Apple Music artist ID"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={createArtist} disabled={!newArtist.name} className="bg-green-500 hover:bg-green-600">
                Create Artist
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Artist Dialog */}
      {editingArtist && (
        <Dialog open={!!editingArtist} onOpenChange={() => setEditingArtist(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Artist</DialogTitle>
              <DialogDescription>Update artist information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Artist Name *</Label>
                <Input
                  id="edit-name"
                  value={editingArtist.name}
                  onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-bio">Biography</Label>
                <Textarea
                  id="edit-bio"
                  value={editingArtist.bio || ""}
                  onChange={(e) => setEditingArtist({ ...editingArtist, bio: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editingArtist.image_url || ""}
                  onChange={(e) => setEditingArtist({ ...editingArtist, image_url: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-spotify">Spotify ID</Label>
                  <Input
                    id="edit-spotify"
                    value={editingArtist.spotify_id || ""}
                    onChange={(e) => setEditingArtist({ ...editingArtist, spotify_id: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-apple">Apple Music ID</Label>
                  <Input
                    id="edit-apple"
                    value={editingArtist.apple_music_id || ""}
                    onChange={(e) => setEditingArtist({ ...editingArtist, apple_music_id: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <Button onClick={updateArtist} className="bg-green-500 hover:bg-green-600">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingArtist(null)}>
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
