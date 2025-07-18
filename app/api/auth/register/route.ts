import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 })
    }

    // Create user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: email,
      name: name,
      subscription_type: "free",
      join_date: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
    }

    return NextResponse.json({
      user: data.user,
      profile: {
        id: data.user.id,
        email: email,
        name: name,
        subscription_type: "free",
        join_date: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
