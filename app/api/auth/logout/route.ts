import { NextRequest, NextResponse } from 'next/server'
import { customSignOut } from '@/lib/auth-custom'

export async function POST(request: NextRequest) {
  try {
    const result = await customSignOut()

    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

    // Clear session cookie
    response.cookies.delete('aura_session')

    return response

  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
