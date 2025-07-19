"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, incrementPlayCount, hasEnoughPlaysForRecommendations } from "@/lib/auth"

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  genre: string
  coverUrl: string
  audioUrl: string
  play_count?: number
}

export interface Station {
  id: string
  name: string
  description: string
  genre: string
  currentTrack?: Track
  listeners: number
  isLive: boolean
  tracks: Track[]
}

export interface Playlist {
  id: string
  name: string
  description: string
  tracks: Track[]
  coverUrl: string
  created_by: string
}

export function useMusicAPI() {
  const [stations, setStations] = useState<Station[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadData()
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate loading

      const currentUser = await getCurrentUser()

      // Only show content if user has enough plays or is new
      if (currentUser && hasEnoughPlaysForRecommendations(currentUser)) {
        // Load personalized content based on user's listening history
        setStations([
          {
            id: "station-1",
            name: "Your Daily Mix",
            description: "Based on your listening history",
            genre: "Mixed",
            listeners: 1,
            isLive: true,
            tracks: [],
          },
          {
            id: "station-2",
            name: "Discover Weekly",
            description: "New music picked for you",
            genre: "Discovery",
            listeners: 1,
            isLive: true,
            tracks: [],
          },
        ])

        setPlaylists([
          {
            id: "playlist-1",
            name: "Liked Songs",
            description: "Your favorite tracks",
            tracks: [],
            coverUrl: "/placeholder.svg?height=200&width=200",
            created_by: currentUser.id,
          },
        ])
      } else {
        // Show empty state for new users
        setStations([])
        setPlaylists([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setStations([])
      setPlaylists([])
    } finally {
      setIsLoading(false)
    }
  }

  const playTrack = async (track: Track) => {
    setCurrentTrack(track)

    // Increment play count
    if (user) {
      await incrementPlayCount(user.id)
      // Reload user data to update play count
      await loadUser()
    }
  }

  const getRecommendations = (userId: string) => {
    if (!hasEnoughPlaysForRecommendations(user)) {
      return []
    }
    // Return recommendations based on user's listening history
    return []
  }

  const searchTracks = (query: string) => {
    // Search implementation
    return []
  }

  return {
    stations,
    playlists,
    currentTrack,
    isLoading,
    user,
    playTrack,
    getRecommendations,
    searchTracks,
    hasEnoughPlays: hasEnoughPlaysForRecommendations(user),
  }
}
