import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies (updated cookie name)
    const sessionToken = request.cookies.get('aura_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token found' },
        { status: 401 }
      )
    }

    // Validate session directly with database
    const { data, error } = await supabase.rpc('validate_session', {
      session_token_param: sessionToken
    })

    if (error) throw error

    const result = data[0]
    if (!result?.valid) {
      const response = NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
      response.cookies.delete('aura_session')
      return response
    }

    return NextResponse.json({
      success: true,
      user: result.user_data
    })

  } catch (error) {
    console.error('User API error:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    response.cookies.delete('aura_session')
    return response
  }
}
