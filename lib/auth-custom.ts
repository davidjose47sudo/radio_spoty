import { supabase } from './supabase'

// =============================================
// HELPER FUNCTIONS FOR CLIENT-SIDE STORAGE
// =============================================
const isClient = () => typeof window !== 'undefined'

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isClient()) return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isClient()) return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silent fail
    }
  },
  removeItem: (key: string): void => {
    if (!isClient()) return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silent fail
    }
  }
}

export interface CustomAuthUser {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "admin" | "premium" | "free"
  subscription_plan: "basic" | "premium" | "family"
  subscription_status: "active" | "cancelled" | "expired" | "pending"
  play_count: number
  preferences: any
  last_active?: string
  created_at?: string
}

export interface AuthResponse {
  data: any
  error: Error | null
}

export interface LoginResponse {
  user: CustomAuthUser | null
  session_token: string | null
  error: Error | null
}

// =============================================
// REGISTRATION
// =============================================
export async function customSignUp(
  email: string, 
  password: string, 
  fullName?: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.rpc("create_user", {
      email_param: email,
      password_param: password,
      full_name_param: fullName || null,
    })

    if (error) throw error

    const result = data[0]
    if (!result.success) {
      return { data: null, error: new Error(result.message) }
    }

    return { data: { user_id: result.user_id, message: result.message }, error: null }
  } catch (error) {
    console.error("Custom signup error:", error)
    return { data: null, error: error as Error }
  }
}

// =============================================
// LOGIN
// =============================================
export async function customSignIn(
  email: string, 
  password: string
): Promise<LoginResponse> {
  try {
    // Get IP and user agent for security (only on client side)
    const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null)
    const ipData = ipResponse ? await ipResponse.json().catch(() => null) : null
    const ipAddress = ipData?.ip || null
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : 'Server'

    const { data, error } = await supabase.rpc("login_user", {
      email_param: email,
      password_param: password,
      ip_address_param: ipAddress,
      user_agent_param: userAgent,
    })

    if (error) throw error

    const result = data[0]
    if (!result.success) {
      return { user: null, session_token: null, error: new Error(result.message) }
    }

    // Store session data (user data in localStorage for quick access)
    const sessionToken = result.session_token
    const userData = result.user_data

    if (typeof window !== 'undefined') {
      // Session token is now managed by HTTP-only cookies, so we only store user data
      safeLocalStorage.setItem("user_data", JSON.stringify(userData))
    }

    return { 
      user: userData, 
      session_token: sessionToken, 
      error: null 
    }
  } catch (error) {
    console.error("Custom signin error:", error)
    return { user: null, session_token: null, error: error as Error }
  }
}

// =============================================
// SESSION VALIDATION
// =============================================
export async function validateCurrentSession(): Promise<CustomAuthUser | null> {
  try {
    // For client-side validation, we'll call our API endpoint
    if (typeof window === 'undefined') return null
    
    const response = await fetch('/api/auth/user', {
      credentials: 'include' // Include cookies
    })
    
    if (!response.ok) {
      // Clear stored user data if session is invalid
      safeLocalStorage.removeItem("user_data")
      return null
    }
    
    const data = await response.json()
    
    if (data.user) {
      // Update stored user data
      safeLocalStorage.setItem("user_data", JSON.stringify(data.user))
      return data.user
    }
    
    safeLocalStorage.removeItem("user_data")
    return null
  } catch (error) {
    console.error("Session validation error:", error)
    safeLocalStorage.removeItem("user_data")
    return null
  }
}

// =============================================
// LOGOUT
// =============================================
export async function customSignOut(): Promise<{ error: Error | null }> {
  try {
    if (typeof window === 'undefined') return { error: null }

    // Call logout API endpoint (which handles cookie clearing and session invalidation)
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include' // Include cookies
    })

    // Clear local user data
    safeLocalStorage.removeItem("user_data")

    return { error: null }
  } catch (error) {
    console.error("Custom signout error:", error)
    return { error: error as Error }
  }
}

// =============================================
// PASSWORD CHANGE
// =============================================
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<AuthResponse> {
  try {
    const user = await validateCurrentSession()
    if (!user) {
      return { data: null, error: new Error('User not authenticated') }
    }

    const { data, error } = await supabase.rpc("change_password", {
      user_id_param: user.id,
      old_password: currentPassword,
      new_password: newPassword,
    })

    if (error) throw error

    const result = data[0]
    if (!result.success) {
      return { data: null, error: new Error(result.message) }
    }

    // Force re-login after password change
    await customSignOut()

    return { data: { message: result.message }, error: null }
  } catch (error) {
    console.error("Change password error:", error)
    return { data: null, error: error as Error }
  }
}

// =============================================
// EMAIL VERIFICATION
// =============================================
export async function generateVerificationToken(): Promise<AuthResponse> {
  try {
    const user = await validateCurrentSession()
    if (!user) {
      return { data: null, error: new Error('User not authenticated') }
    }

    const { data, error } = await supabase.rpc("generate_verification_token", {
      user_id_param: user.id
    })

    if (error) throw error

    return { data: { token: data }, error: null }
  } catch (error) {
    console.error("Generate verification token error:", error)
    return { data: null, error: error as Error }
  }
}

export async function verifyEmail(token: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.rpc("verify_email", {
      token: token
    })

    if (error) throw error

    const result = data[0]
    if (!result.success) {
      return { data: null, error: new Error(result.message) }
    }

    return { data: { message: result.message }, error: null }
  } catch (error) {
    console.error("Verify email error:", error)
    return { data: null, error: error as Error }
  }
}

// =============================================
// SUBSCRIPTION MANAGEMENT
// =============================================
export async function updateSubscriptionPlan(
  plan: "basic" | "premium" | "family",
  status: "active" | "cancelled" | "expired" | "pending" = "active"
): Promise<AuthResponse> {
  try {
    const user = await validateCurrentSession()
    if (!user) {
      return { data: null, error: new Error('User not authenticated') }
    }

    const { data, error } = await supabase.rpc("update_subscription_plan", {
      user_id_param: user.id,
      new_plan: plan,
      new_status: status
    })

    if (error) throw error

    const result = data[0]
    if (!result.success) {
      return { data: null, error: new Error(result.message) }
    }

    // Refresh user data
    await validateCurrentSession()

    return { data: { message: result.message }, error: null }
  } catch (error) {
    console.error("Update subscription error:", error)
    return { data: null, error: error as Error }
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================
export function getCurrentUser(): CustomAuthUser | null {
  if (typeof window === 'undefined') return null
  
  const userData = safeLocalStorage.getItem("user_data")
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function getSessionToken(): string | null {
  // Session tokens are now managed by HTTP-only cookies
  // This function is kept for compatibility but always returns null
  return null
}

export function isAuthenticated(): boolean {
  // With cookie-based auth, we check for user data presence
  // The actual validation should be done server-side or via API
  return getCurrentUser() !== null
}

export function hasRole(requiredRole: "admin" | "premium" | "free"): boolean {
  const user = getCurrentUser()
  if (!user) return false

  switch (requiredRole) {
    case "admin":
      return user.role === "admin"
    case "premium":
      return user.role === "premium" || user.role === "admin"
    case "free":
      return true // Everyone has free access
    default:
      return false
  }
}

export function hasSubscriptionPlan(requiredPlan: "basic" | "premium" | "family"): boolean {
  const user = getCurrentUser()
  if (!user) return false

  switch (requiredPlan) {
    case "family":
      return user.subscription_plan === "family"
    case "premium":
      return user.subscription_plan === "premium" || user.subscription_plan === "family"
    case "basic":
      return user.subscription_status === "active" // Any active subscription
    default:
      return false
  }
}

export function canUseAIFeatures(): boolean {
  const user = getCurrentUser()
  if (!user) return false
  
  return (
    user.subscription_status === "active" &&
    (user.subscription_plan === "premium" || user.subscription_plan === "family")
  )
}

// =============================================
// AUTH CONTEXT HOOK
// =============================================
export function useAuth() {
  return {
    user: getCurrentUser(),
    sessionToken: getSessionToken(),
    isAuthenticated: isAuthenticated(),
    signUp: customSignUp,
    signIn: customSignIn,
    signOut: customSignOut,
    validateSession: validateCurrentSession,
    changePassword: changePassword,
    verifyEmail: verifyEmail,
    updateSubscriptionPlan: updateSubscriptionPlan,
    hasRole: hasRole,
    hasSubscriptionPlan: hasSubscriptionPlan,
    canUseAIFeatures: canUseAIFeatures,
  }
}
