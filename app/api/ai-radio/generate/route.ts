import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { aiRadioGenerator } from '@/lib/ai-radio-generator'

export async function POST(request: NextRequest) {
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

    // Get request body
    const { prompt } = await request.json()
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Check if user has premium subscription for AI features
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    if (!profile || !['premium', 'family'].includes(profile.subscription_plan)) {
      return NextResponse.json(
        { error: 'Premium subscription required for AI radio generation' },
        { status: 403 }
      )
    }

    // Generate AI radio
    const result = await aiRadioGenerator.generateRadioFromPrompt(user.id, prompt.trim())
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate AI radio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      jobId: result.jobId,
      message: 'AI radio generation started. You will be notified when it\'s ready.'
    })

  } catch (error) {
    console.error('Error in AI radio generation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
