import { NextRequest, NextResponse } from 'next/server'
import { aiRadioGenerator } from '@/lib/ai-radio-generator'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is coming from a cron job or authorized source
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Processing pending AI radio jobs...')
    
    // Process all pending AI radio jobs
    await aiRadioGenerator.processAllPendingJobs()
    
    console.log('Finished processing pending AI radio jobs')

    return NextResponse.json({
      success: true,
      message: 'Processed all pending AI radio jobs'
    })

  } catch (error) {
    console.error('Error in cron job for AI radio processing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
