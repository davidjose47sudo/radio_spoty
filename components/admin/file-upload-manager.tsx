"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Music, FileAudio, CheckCircle, XCircle, AlertCircle, Trash2, Play, Pause } from "lucide-react"
import { uploadAudioFile, getAudioDuration, type UploadProgress } from "@/lib/file-upload"

interface UploadedFile {
  id: string
  file: File
  title: string
  artists: string[]
  genres: string[]
  duration?: number
  status: "uploading" | "processing" | "ready" | "error"
  progress: number
  url?: string
  compressedUrl?: string
  error?: string
}

export function FileUploadManager() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [availableArtists, setAvailableArtists] = useState([
    "The Beatles",
    "Queen",
    "Michael Jackson",
    "Madonna",
    "Prince",
  ])
  const [availableGenres, setAvailableGenres] = useState(["Pop", "Rock", "Hip Hop", "Electronic", "Jazz"])
  const [playingFile, setPlayingFile] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = async (fileList: File[]) => {
    const audioFiles = fileList.filter((file) =>
      ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"].includes(file.type),
    )

    for (const file of audioFiles) {
      const fileId = `${Date.now()}-${Math.random()}`
      const newFile: UploadedFile = {
        id: fileId,
        file,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artists: [],
        genres: [],
        status: "uploading",
        progress: 0,
      }

      setFiles((prev) => [...prev, newFile])

      try {
        // Get audio duration
        const duration = await getAudioDuration(file)
        updateFile(fileId, { duration })

        // Upload file
        const result = await uploadAudioFile(file, (progress: UploadProgress) => {
          updateFile(fileId, { progress: progress.percentage })
        })

        if (result.success) {
          updateFile(fileId, {
            status: "ready",
            progress: 100,
            url: result.file_url,
            compressedUrl: result.compressed_url,
          })
        } else {
          updateFile(fileId, {
            status: "error",
            error: result.error,
          })
        }
      } catch (error) {
        updateFile(fileId, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        })
      }
    }
  }

  const updateFile = (fileId: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, ...updates } : file)))
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const saveToDatabase = async (file: UploadedFile) => {
    try {
      updateFile(file.id, { status: "processing" })

      // Here you would save to your database
      const response = await fetch("/api/admin/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: file.title,
          duration: file.duration,
          file_url: file.url,
          compressed_url: file.compressedUrl,
          file_size: file.file.size,
          file_format: file.file.type,
          artists: file.artists,
          genres: file.genres,
        }),
      })

      if (response.ok) {
        updateFile(file.id, { status: "ready" })
      } else {
        throw new Error("Failed to save to database")
      }
    } catch (error) {
      updateFile(file.id, {
        status: "error",
        error: error instanceof Error ? error.message : "Failed to save",
      })
    }
  }

  const playAudio = (file: UploadedFile) => {
    if (audioRef.current && file.url) {
      if (playingFile === file.id) {
        audioRef.current.pause()
        setPlayingFile(null)
      } else {
        audioRef.current.src = file.url
        audioRef.current.play()
        setPlayingFile(file.id)
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">File Upload Manager</h2>
          <p className="text-gray-400">Upload and manage audio files for your platform</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} className="bg-green-500 hover:bg-green-600">
          <Upload className="w-4 h-4 mr-2" />
          Select Files
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-green-400 bg-green-400/10"
                : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Drop audio files here</h3>
            <p className="text-gray-400 mb-4">or click to select files</p>
            <p className="text-sm text-gray-500">Supports MP3, MP4, WAV, OGG (max 50MB each)</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileAudio className="w-5 h-5 mr-2" />
              Uploaded Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{file.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{formatFileSize(file.file.size)}</span>
                          {file.duration && <span>{formatDuration(file.duration)}</span>}
                          <span>{file.file.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {file.status === "ready" && file.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => playAudio(file)}
                          className="text-gray-400 hover:text-white"
                        >
                          {playingFile === file.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2 mb-4">
                    {file.status === "uploading" && (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">Uploading...</span>
                      </>
                    )}
                    {file.status === "processing" && (
                      <>
                        <AlertCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">Processing...</span>
                      </>
                    )}
                    {file.status === "ready" && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Ready</span>
                      </>
                    )}
                    {file.status === "error" && (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Error: {file.error}</span>
                      </>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {(file.status === "uploading" || file.status === "processing") && (
                    <Progress value={file.progress} className="mb-4" />
                  )}

                  {/* Metadata Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${file.id}`} className="text-white">
                        Title
                      </Label>
                      <Input
                        id={`title-${file.id}`}
                        value={file.title}
                        onChange={(e) => updateFile(file.id, { title: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Artists</Label>
                      <Select
                        onValueChange={(value) => {
                          if (!file.artists.includes(value)) {
                            updateFile(file.id, { artists: [...file.artists, value] })
                          }
                        }}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select artists" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableArtists.map((artist) => (
                            <SelectItem key={artist} value={artist}>
                              {artist}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.artists.map((artist) => (
                          <Badge
                            key={artist}
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-400 cursor-pointer"
                            onClick={() => updateFile(file.id, { artists: file.artists.filter((a) => a !== artist) })}
                          >
                            {artist} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Genres</Label>
                      <Select
                        onValueChange={(value) => {
                          if (!file.genres.includes(value)) {
                            updateFile(file.id, { genres: [...file.genres, value] })
                          }
                        }}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select genres" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGenres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.genres.map((genre) => (
                          <Badge
                            key={genre}
                            variant="secondary"
                            className="bg-green-500/20 text-green-400 cursor-pointer"
                            onClick={() => updateFile(file.id, { genres: file.genres.filter((g) => g !== genre) })}
                          >
                            {genre} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end">
                      {file.status === "ready" && (
                        <Button
                          onClick={() => saveToDatabase(file)}
                          className="bg-green-500 hover:bg-green-600 w-full"
                          disabled={file.artists.length === 0 || file.genres.length === 0}
                        >
                          Save to Database
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingFile(null)}
        onError={() => setPlayingFile(null)}
        className="hidden"
      />
    </div>
  )
}
