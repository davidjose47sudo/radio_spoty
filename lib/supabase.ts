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
  subscription_expires_at?: string
  preferences: any
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Artist {
  id: string
  name: string
  bio?: string
  image_url?: string
  spotify_id?: string
  apple_music_id?: string
  metadata: any
  created_at: string
  updated_at: string
  deleted_at?: string
  created_by?: string
  updated_by?: string
}

export interface Genre {
  id: string
  name: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  created_by?: string
  updated_by?: string
}

export interface Song {
  id: string
  title: string
  duration?: number
  file_url?: string
  file_size?: number
  file_format?: string
  compressed_url?: string
  compressed_size?: number
  status: "uploading" | "processing" | "ready" | "error"
  play_count: number
  metadata: any
  created_at: string
  updated_at: string
  deleted_at?: string
  created_by?: string
  updated_by?: string
  artists?: Artist[]
  genres?: Genre[]
}

export interface RadioStation {
  id: string
  name: string
  description?: string
  image_url?: string
  is_ai_generated: boolean
  ai_prompt?: string
  is_active: boolean
  play_count: number
  metadata: any
  created_at: string
  updated_at: string
  deleted_at?: string
  created_by?: string
  updated_by?: string
  songs?: Song[]
}

export interface Subscription {
  id: string
  user_id: string
  plan: "free" | "premium" | "family"
  status: "active" | "cancelled" | "expired" | "pending"
  stripe_subscription_id?: string
  stripe_customer_id?: string
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  cancelled_at?: string
  metadata: any
  created_at: string
  updated_at: string
  deleted_at?: string
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
