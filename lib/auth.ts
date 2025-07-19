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

    // Log the signup event
    await logGlobalEvent({
      user_id: data.user?.id,
      event_type: "auth",
      action: "user_signup",
      metadata: { email, has_full_name: !!fullName },
    })

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
    await logGlobalEvent({
      user_id: data.user?.id,
      event_type: "auth",
      action: "user_signin",
      metadata: { email },
    })

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
    await logGlobalEvent({
      user_id: user?.id,
      event_type: "auth",
      action: "user_signout",
      metadata: {},
    })

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

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error

    // Log the password reset event
    await logGlobalEvent({
      event_type: "auth",
      action: "password_reset_request",
      metadata: { email },
    })

    return { data, error: null }
  } catch (error) {
    console.error("Reset password error:", error)
    return { data: null, error }
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    // Log the password update event
    await logGlobalEvent({
      user_id: user.id,
      event_type: "auth",
      action: "password_update",
      metadata: {},
    })

    return { data, error: null }
  } catch (error) {
    console.error("Update password error:", error)
    return { data: null, error }
  }
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
