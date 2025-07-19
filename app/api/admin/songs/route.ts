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
    const { title, duration, file_url, compressed_url, file_size, file_format, artists, genres } = body

    // Insert song
    const { data: song, error: songError } = await supabase
      .from("songs")
      .insert({
        title,
        duration,
        file_url,
        compressed_url,
        file_size,
        file_format,
        status: "ready",
        created_by: user.id,
      })
      .select()
      .single()

    if (songError) throw songError

    // Add artists
    if (artists && artists.length > 0) {
      for (const artistName of artists) {
        // Find or create artist
        let { data: artist, error: artistError } = await supabase
          .from("artists")
          .select("id")
          .eq("name", artistName)
          .single()

        if (artistError) {
          // Create new artist
          const { data: newArtist, error: createArtistError } = await supabase
            .from("artists")
            .insert({ name: artistName, created_by: user.id })
            .select("id")
            .single()

          if (createArtistError) throw createArtistError
          artist = newArtist
        }

        // Link song to artist
        await supabase.from("song_artists").insert({
          song_id: song.id,
          artist_id: artist.id,
          created_by: user.id,
        })
      }
    }

    // Add genres
    if (genres && genres.length > 0) {
      for (const genreName of genres) {
        // Find genre
        const { data: genre, error: genreError } = await supabase
          .from("genres")
          .select("id")
          .eq("name", genreName)
          .single()

        if (!genreError && genre) {
          // Link song to genre
          await supabase.from("song_genres").insert({
            song_id: song.id,
            genre_id: genre.id,
            created_by: user.id,
          })
        }
      }
    }

    // Log the event
    await logGlobalEvent({
      user_id: user.id,
      event_type: "admin",
      action: "song_created",
      resource_type: "song",
      resource_id: song.id,
      metadata: {
        title,
        artists,
        genres,
        file_size,
        file_format,
      },
    })

    return NextResponse.json({ success: true, song })
  } catch (error) {
    console.error("Error creating song:", error)
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
    const genre = searchParams.get("genre") || ""
    const status = searchParams.get("status") || ""

    let query = supabase
      .from("songs")
      .select(`
        *,
        song_artists (
          artists (
            id,
            name
          )
        ),
        song_genres (
          genres (
            id,
            name,
            color
          )
        )
      `)
      .is("deleted_at", null)

    // Apply filters
    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    if (status) {
      query = query.eq("status", status)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: songs, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      songs,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching songs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
