import { supabase } from "./supabase"

export interface GlobalEventData {
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
  metadata?: any
}

export async function logGlobalEvent(eventData: GlobalEventData) {
  try {
    // Get IP and location info if not provided
    if (!eventData.ip_address && typeof window !== "undefined") {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const locationData = await response.json()
        eventData.ip_address = locationData.ip
        eventData.country = locationData.country_name
        eventData.city = locationData.city
      } catch (error) {
        console.warn("Could not get location data:", error)
      }
    }

    // Get user agent if not provided
    if (!eventData.user_agent && typeof window !== "undefined") {
      eventData.user_agent = navigator.userAgent
    }

    const { error } = await supabase.from("global_events").insert({
      user_id: eventData.user_id,
      event_type: eventData.event_type,
      action: eventData.action,
      resource_type: eventData.resource_type,
      resource_id: eventData.resource_id,
      route: eventData.route,
      method: eventData.method,
      request_body: eventData.request_body,
      response_body: eventData.response_body,
      status_code: eventData.status_code,
      ip_address: eventData.ip_address,
      user_agent: eventData.user_agent,
      country: eventData.country,
      city: eventData.city,
      metadata: eventData.metadata || {},
    })

    if (error) {
      console.error("Failed to log global event:", error)
    }
  } catch (error) {
    console.error("Error logging global event:", error)
  }
}

export async function getEventsByUser(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("global_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error getting user events:", error)
    return { data: null, error }
  }
}

export async function getEventsByType(eventType: string, limit = 100) {
  try {
    const { data, error } = await supabase
      .from("global_events")
      .select("*")
      .eq("event_type", eventType)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error getting events by type:", error)
    return { data: null, error }
  }
}

export async function getRecentEvents(limit = 100) {
  try {
    const { data, error } = await supabase
      .from("global_events")
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error getting recent events:", error)
    return { data: null, error }
  }
}

export async function getEventStats(days = 7) {
  try {
    const { data, error } = await supabase
      .from("global_events")
      .select("event_type, action, created_at")
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    // Process stats
    const stats = {
      total_events: data.length,
      by_type: {} as Record<string, number>,
      by_action: {} as Record<string, number>,
      by_day: {} as Record<string, number>,
    }

    data.forEach((event) => {
      // Count by type
      stats.by_type[event.event_type] = (stats.by_type[event.event_type] || 0) + 1

      // Count by action
      stats.by_action[event.action] = (stats.by_action[event.action] || 0) + 1

      // Count by day
      const day = new Date(event.created_at).toISOString().split("T")[0]
      stats.by_day[day] = (stats.by_day[day] || 0) + 1
    })

    return { data: stats, error: null }
  } catch (error) {
    console.error("Error getting event stats:", error)
    return { data: null, error }
  }
}
