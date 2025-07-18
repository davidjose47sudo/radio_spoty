"use client"

import { useState, useEffect } from "react"

// Simulación de API propia para música
export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  genre: string
  coverUrl: string
  audioUrl: string
}

export interface Station {
  id: string
  name: string
  description: string
  genre: string
  currentTrack: Track
  listeners: number
  isLive: boolean
  tracks: Track[]
}

// Hook personalizado para manejar la API de música
export function useMusicAPI() {
  const [stations, setStations] = useState<Station[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulación de datos de la API
  const mockTracks: Track[] = [
    {
      id: "1",
      title: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
      duration: 243,
      genre: "Electronic",
      coverUrl: "/placeholder.svg?height=300&width=300",
      audioUrl: "/audio/midnight-city.mp3",
    },
    {
      id: "2",
      title: "Strobe",
      artist: "Deadmau5",
      album: "For Lack of a Better Name",
      duration: 634,
      genre: "Electronic",
      coverUrl: "/placeholder.svg?height=300&width=300",
      audioUrl: "/audio/strobe.mp3",
    },
    {
      id: "3",
      title: "Breathe Me",
      artist: "Sia",
      album: "Colour the Small One",
      duration: 273,
      genre: "Alternative",
      coverUrl: "/placeholder.svg?height=300&width=300",
      audioUrl: "/audio/breathe-me.mp3",
    },
  ]

  const mockStations: Station[] = [
    {
      id: "station-1",
      name: "Global Hits FM",
      description: "The biggest hits from around the world",
      genre: "Pop",
      currentTrack: mockTracks[0],
      listeners: 45200,
      isLive: true,
      tracks: mockTracks,
    },
    {
      id: "station-2",
      name: "Electronic Pulse",
      description: "Electronic beats and ambient sounds",
      genre: "Electronic",
      currentTrack: mockTracks[1],
      listeners: 28900,
      isLive: true,
      tracks: mockTracks,
    },
    {
      id: "station-3",
      name: "Indie Discovery",
      description: "Discover new indie and alternative artists",
      genre: "Alternative",
      currentTrack: mockTracks[2],
      listeners: 15200,
      isLive: true,
      tracks: mockTracks,
    },
  ]

  useEffect(() => {
    // Simular carga de API
    const loadData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStations(mockStations)
      setCurrentTrack(mockTracks[0])
      setIsLoading(false)
    }

    loadData()
  }, [])

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
  }

  const getRecommendations = (userId: string) => {
    // Simulación de recomendaciones basadas en IA
    return mockTracks.slice(0, 3)
  }

  const searchTracks = (query: string) => {
    return mockTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return {
    stations,
    currentTrack,
    isLoading,
    playTrack,
    getRecommendations,
    searchTracks,
  }
}
