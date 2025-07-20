import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "admin" | "premium" | "free"
  subscription_plan: "free" | "premium" | "family"
  subscription_status: "active" | "cancelled" | "expired" | "pending"
  play_count: number
  preferences: any
  last_active: string
  created_at: string
  updated_at: string
}

export interface Artist {
  id: string
  name: string
  bio?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  title: string
  artist_id?: string
  release_date?: string
  genre?: string
  cover_url?: string
  created_at: string
  updated_at: string
  artist?: Artist
}

export interface Song {
  id: string
  title: string
  artist_id?: string
  album_id?: string
  duration: number
  genre?: string
  url: string
  cover_url?: string
  created_at: string
  updated_at: string
  artist?: Artist
  album?: Album
}

export interface Playlist {
  id: string
  user_id: string
  title: string
  description?: string
  is_public: boolean
  tracks_count: number
  total_duration: number
  cover_url?: string
  created_at: string
  updated_at: string
  user?: Profile
  playlist_tracks?: PlaylistTrack[]
}

export interface PlaylistTrack {
  id: string
  playlist_id: string
  song_id: string
  added_at: string
  song?: Song
  playlist?: Playlist
}

export interface Jam {
  id: string
  host_id: string
  title?: string
  description?: string
  invite_code?: string
  is_active: boolean
  current_song_id?: string
  created_at: string
  updated_at: string
  host?: Profile
  current_song?: Song
}

export interface RadioStation {
  id: string
  name: string
  stream_url: string
  logo_url?: string
  genre?: string
  language?: string
  country?: string
  is_ai_generated: boolean
  ai_prompt?: string
  is_active: boolean
  play_count: number
  metadata: any
  created_at: string
  updated_at: string
  songs?: Song[]
}

export interface RadioStationSong {
  id: string
  radio_station_id: string
  song_id: string
  order_index: number
  added_at: string
  radio_station?: RadioStation
  song?: Song
}

export interface Subscription {
  id: string
  user_id: string
  plan: "free" | "premium" | "family"
  status: "active" | "cancelled" | "expired" | "pending"
  started_at: string
  expires_at?: string
  renewed_at?: string
  created_at: string
  updated_at: string
  user?: Profile
}

export interface UserPreferences {
  id: string
  user_id: string
  preferences: any
  created_at: string
  updated_at: string
  user?: Profile
}

export interface AIRadioJob {
  id: string
  user_id: string
  prompt: string
  status: "pending" | "processing" | "completed" | "failed"
  radio_station_id?: string
  error_message?: string
  metadata: any
  created_at: string
  updated_at: string
  user?: Profile
  radio_station?: RadioStation
}

export interface WeeklyAIRadio {
  id: string
  user_id: string
  week_start_date: string
  theme: string
  generated_at?: string
  radio_station_id?: string
  status: "pending" | "generating" | "completed" | "failed"
  created_at: string
  updated_at: string
  user?: Profile
  radio_station?: RadioStation
}

export interface GlobalEvent {
  id: string
  user_id?: string
  event_type: "auth" | "upload" | "play" | "subscription" | "admin" | "api"
  action: string
  resource_type?: string
  resource_id?: string
  route?: string
  method?: string
  request_body?: any
  response_body?: any
  status_code?: number
  ip_address?: string
  user_agent?: string
  country?: string
  city?: string
  metadata: any
  created_at: string
}
