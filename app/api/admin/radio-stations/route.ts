import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { logGlobalEvent } from "@/lib/events"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, is_ai_generated, ai_prompt, songs, metadata } = body

    // Insert radio station
    const { data: station, error: stationError } = await supabase
      .from("radio_stations")
      .insert({
        name,
        description,
        is_ai_generated: is_ai_generated || false,
        ai_prompt,
        is_active: true,
        created_by: user.id,
      })
      .select()
      .single()

    if (stationError) throw stationError

    // Add songs to station if provided
    if (songs && songs.length > 0) {
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i]

        // Find song by title and artist (in real app, you'd have better matching)
        const { data: existingSong } = await supabase
          .from("songs")
          .select("id")
          .eq("title", song.title)
          .limit(1)
          .single()

        if (existingSong) {
          await supabase.from("radio_station_songs").insert({
            radio_station_id: station.id,
            song_id: existingSong.id,
            position: i + 1,
            created_by: user.id,
          })
        }
      }
    }

    // Store AI generation metadata if applicable
    if (is_ai_generated && ai_prompt) {
      await supabase.from("ai_generations").insert({
        type: "radio_station",
        prompt: ai_prompt,
        result: metadata,
        resource_id: station.id,
        created_by: user.id,
      })
    }

    // Log the event
    await logGlobalEvent({
      user_id: user.id,
      event_type: "admin",
      action: is_ai_generated ? "ai_radio_station_created" : "radio_station_created",
      resource_type: "radio_station",
      resource_id: station.id,
      metadata: {
        name,
        is_ai_generated,
        song_count: songs?.length || 0,
        ai_prompt: is_ai_generated ? ai_prompt : undefined,
      },
    })

    return NextResponse.json({ success: true, station })
  } catch (error) {
    console.error("Error creating radio station:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const status = searchParams.get("status") || ""

    let query = supabase
      .from("radio_stations")
      .select(`
        *,
        radio_station_songs (
          songs (
            id,
            title
          )
        ),
        profiles (
          full_name,
          email
        )
      `)
      .is("deleted_at", null)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (type === "ai") {
      query = query.eq("is_ai_generated", true)
    } else if (type === "manual") {
      query = query.eq("is_ai_generated", false)
    }

    if (status === "active") {
      query = query.eq("is_active", true)
    } else if (status === "inactive") {
      query = query.eq("is_active", false)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: stations, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      stations,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching radio stations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
