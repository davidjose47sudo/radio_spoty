import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { generateWeeklyAIRadios } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Generate weekly AI radios
    const { error } = await generateWeeklyAIRadios()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to generate weekly AI radios' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Weekly AI radio generation initiated for all eligible users'
    })

  } catch (error) {
    console.error('Error generating weekly AI radios:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current week's radio for user
    const currentWeekStart = new Date()
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1) // Monday
    const weekStartDate = currentWeekStart.toISOString().split('T')[0]

    const { data: weeklyRadio, error } = await supabase
      .from('weekly_ai_radios')
      .select(`
        *,
        radio_station:radio_stations(*)
      `)
      .eq('user_id', user.id)
      .eq('week_start_date', weekStartDate)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      return NextResponse.json(
        { error: 'Failed to get weekly radio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      weekly_radio: weeklyRadio,
      week_start_date: weekStartDate
    })

  } catch (error) {
    console.error('Error getting weekly AI radio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
