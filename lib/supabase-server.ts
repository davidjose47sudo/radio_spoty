import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      storage: {
        getItem: async (key: string) => {
          const cookieStore = await cookies()
          return cookieStore.get(key)?.value ?? null
        },
        setItem: async (key: string, value: string) => {
          const cookieStore = await cookies()
          cookieStore.set(key, value)
        },
        removeItem: async (key: string) => {
          const cookieStore = await cookies()
          cookieStore.delete(key)
        },
      },
    },
  })
}
