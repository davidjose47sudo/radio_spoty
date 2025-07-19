import { createClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const artistIds = JSON.parse((formData.get("artistIds") as string) || "[]")
    const genreIds = JSON.parse((formData.get("genreIds") as string) || "[]")

    if (!file || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error: uploadError } = await supabase.storage.from("music-files").upload(fileName, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Insert the rest of the code here

    return NextResponse.json({ message: "File uploaded successfully", data }, { status: 200 })
  } catch (error) {
    console.error("Error in upload route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
