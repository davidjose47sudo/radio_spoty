"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { supabase, type Genre } from "@/lib/supabase"

export function GenreManager() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newGenre, setNewGenre] = useState({
    name: "",
    description: "",
    color: "#FF6B6B",
  })

  const predefinedColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#82E0AA",
    "#85C1E9",
    "#F8C471",
    "#EC7063",
    "#A569BD",
    "#5DADE2",
    "#58D68D",
  ]

  useEffect(() => {
    loadGenres()
  }, [])

  const loadGenres = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("genres")
        .select(`
          *,
          song_genres (
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
      const transformedGenres = data.map((genre) => ({
        ...genre,
        song_count: genre.song_genres?.length || 0,
      }))

      setGenres(transformedGenres)
    } catch (error) {
      console.error("Error loading genres:", error)
    } finally {
      setLoading(false)
    }
  }

  const createGenre = async () => {
    try {
      const { data, error } = await supabase.from("genres").insert([newGenre]).select().single()

      if (error) throw error

      setGenres([...genres, { ...data, song_count: 0 }])
      setNewGenre({ name: "", description: "", color: "#FF6B6B" })
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Error creating genre:", error)
    }
  }

  const updateGenre = async () => {
    if (!editingGenre) return

    try {
      const { data, error } = await supabase
        .from("genres")
        .update({
          name: editingGenre.name,
          description: editingGenre.description,
          color: editingGenre.color,
        })
        .eq("id", editingGenre.id)
        .select()
        .single()

      if (error) throw error

      setGenres(
        genres.map((genre) => (genre.id === editingGenre.id ? { ...data, song_count: genre.song_count } : genre)),
      )
      setEditingGenre(null)
    } catch (error) {
      console.error("Error updating genre:", error)
    }
  }

  const deleteGenre = async (genreId: string) => {
    if (!confirm("Are you sure you want to delete this genre?")) return

    try {
      const { error } = await supabase.from("genres").update({ deleted_at: new Date().toISOString() }).eq("id", genreId)

      if (error) throw error

      setGenres(genres.filter((genre) => genre.id !== genreId))
    } catch (error) {
      console.error("Error deleting genre:", error)
    }
  }

  const filteredGenres = genres.filter((genre) => genre.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Genre Management</h2>
          <p className="text-gray-400">Manage music genres and categories</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Genre
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGenres.map((genre) => (
          <Card key={genre.id} className="bg-gray-800 border-gray-700 hover:bg-gray-700/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: genre.color }} />
                  <h3 className="text-white font-medium">{genre.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingGenre(genre)}
                    className="text-gray-400 hover:text-white h-8 w-8"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGenre(genre.id)}
                    className="text-red-400 hover:text-red-300 h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {genre.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{genre.description}</p>}

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  {genre.song_count} songs
                </Badge>
                <span className="text-gray-500 text-xs">{new Date(genre.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Genre Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Genre</DialogTitle>
            <DialogDescription>Create a new music genre category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Genre Name *</Label>
              <Input
                id="name"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter genre name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGenre.description}
                onChange={(e) => setNewGenre({ ...newGenre, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter genre description"
                rows={3}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex items-center space-x-3 mt-2">
                <input
                  type="color"
                  value={newGenre.color}
                  onChange={(e) => setNewGenre({ ...newGenre, color: e.target.value })}
                  className="w-12 h-8 rounded border border-gray-600 bg-gray-700"
                />
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewGenre({ ...newGenre, color })}
                      className={`w-6 h-6 rounded-full border-2 ${
                        newGenre.color === color ? "border-white" : "border-gray-600"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={createGenre} disabled={!newGenre.name} className="bg-green-500 hover:bg-green-600">
                Create Genre
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Genre Dialog */}
      {editingGenre && (
        <Dialog open={!!editingGenre} onOpenChange={() => setEditingGenre(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Genre</DialogTitle>
              <DialogDescription>Update genre information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Genre Name *</Label>
                <Input
                  id="edit-name"
                  value={editingGenre.name}
                  onChange={(e) => setEditingGenre({ ...editingGenre, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingGenre.description || ""}
                  onChange={(e) => setEditingGenre({ ...editingGenre, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="color"
                    value={editingGenre.color || "#FF6B6B"}
                    onChange={(e) => setEditingGenre({ ...editingGenre, color: e.target.value })}
                    className="w-12 h-8 rounded border border-gray-600 bg-gray-700"
                  />
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingGenre({ ...editingGenre, color })}
                        className={`w-6 h-6 rounded-full border-2 ${
                          editingGenre.color === color ? "border-white" : "border-gray-600"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button onClick={updateGenre} className="bg-green-500 hover:bg-green-600">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingGenre(null)}>
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
