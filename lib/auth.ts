import { supabase } from "./supabase"
import { logGlobalEvent } from "./events"

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "admin" | "premium" | "free"
  subscription_plan: "free" | "premium" | "family"
  subscription_status: "active" | "cancelled" | "expired" | "pending"
  created_at?: string
  play_count?: number
}

export async function signUp(email: string, password: string, fullName?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // Create profile in database
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: "free",
        subscription_plan: "free",
        subscription_status: "active",
        play_count: 0,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }

      // Log the signup event
      await logGlobalEvent({
        user_id: data.user.id,
        event_type: "auth",
        action: "user_signup",
        metadata: { email, has_full_name: !!fullName },
      })
    }

    return { data, error: null }
  } catch (error) {
    console.error("Signup error:", error)
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Log the signin event
    if (data.user) {
      await logGlobalEvent({
        user_id: data.user.id,
        event_type: "auth",
        action: "user_signin",
        metadata: { email },
      })
    }

    return { data, error: null }
  } catch (error) {
    console.error("Signin error:", error)
    return { data: null, error }
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Google signin error:", error)
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const user = await getCurrentUser()

    const { error } = await supabase.auth.signOut()

    if (error) throw error

    // Log the signout event
    if (user) {
      await logGlobalEvent({
        user_id: user.id,
        event_type: "auth",
        action: "user_signout",
        metadata: {},
      })
    }

    return { error: null }
  } catch (error) {
    console.error("Signout error:", error)
    return { error }
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) return null

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) return null

    return {
      id: user.id,
      email: user.email!,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      subscription_plan: profile.subscription_plan,
      subscription_status: profile.subscription_status,
      created_at: profile.created_at,
      play_count: profile.play_count || 0,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function updateProfile(updates: Partial<AuthUser>) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error

    // Log the profile update event
    await logGlobalEvent({
      user_id: user.id,
      event_type: "auth",
      action: "profile_update",
      metadata: { updates },
    })

    return { data, error: null }
  } catch (error) {
    console.error("Update profile error:", error)
    return { data: null, error }
  }
}

export async function incrementPlayCount(userId: string) {
  try {
    const { error } = await supabase.rpc("increment_play_count", {
      user_id: userId,
    })

    if (error) throw error

    // Log the play event
    await logGlobalEvent({
      user_id: userId,
      event_type: "music",
      action: "track_play",
      metadata: {},
    })

    return { error: null }
  } catch (error) {
    console.error("Increment play count error:", error)
    return { error }
  }
}

// Demo admin credentials
export const ADMIN_CREDENTIALS = {
  email: "admin@auraradio.com",
  password: "AuraAdmin2024!",
  role: "admin",
}

export const DEMO_CREDENTIALS = {
  free: {
    email: "demo@auraradio.com",
    password: "demo123",
  },
  premium: {
    email: "premium@auraradio.com",
    password: "premium123",
  },
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin"
}

export function isPremium(user: AuthUser | null): boolean {
  return user?.role === "premium" || user?.role === "admin"
}

export function hasActiveSubscription(user: AuthUser | null): boolean {
  return user?.subscription_status === "active"
}

export function hasEnoughPlaysForRecommendations(user: AuthUser | null): boolean {
  return (user?.play_count || 0) >= 10
}
