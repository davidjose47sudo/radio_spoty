import { GoogleGenerativeAI } from '@google/generative-ai'
import { 
  createAIRadioJob, 
  updateAIRadioJob, 
  createRadioStation, 
  addSongToRadioStation,
  getSongs,
  getPendingAIRadioJobs
} from './database'
import type { Song, AIRadioJob } from './supabase'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface AIRadioSuggestion {
  name: string
  description: string
  genre: string
  songs: {
    title: string
    artist: string
    reason: string
  }[]
}

export class AIRadioGenerator {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  async generateRadioFromPrompt(userId: string, prompt: string): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      // Create AI radio job
      const { data: job, error: jobError } = await createAIRadioJob({
        user_id: userId,
        prompt,
        metadata: {}
      })

      if (jobError || !job) {
        return { success: false, error: 'Failed to create AI radio job' }
      }

      // Process job asynchronously
      this.processAIRadioJob(job.id)

      return { success: true, jobId: job.id }
    } catch (error) {
      console.error('Error generating radio from prompt:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  private async processAIRadioJob(jobId: string) {
    try {
      // Update job status to processing
      await updateAIRadioJob(jobId, { status: 'processing' })

      // Get job details
      const { data: job } = await updateAIRadioJob(jobId, {})
      if (!job) throw new Error('Job not found')

      // Get available songs from database
      const { data: availableSongs } = await getSongs()
      if (!availableSongs || availableSongs.length === 0) {
        throw new Error('No songs available in database')
      }

      // Generate radio suggestion using AI
      const suggestion = await this.generateRadioSuggestion(job.prompt, availableSongs)

      // Create radio station
      const { data: radioStation, error: stationError } = await createRadioStation({
        name: suggestion.name,
        stream_url: '', // For AI-generated radios, we don't need a stream URL
        genre: suggestion.genre,
        language: 'en',
        country: 'US',
        is_ai_generated: true,
        ai_prompt: job.prompt,
        is_active: true,
        metadata: {
          description: suggestion.description,
          generated_by_ai: true,
          generation_prompt: job.prompt
        }
      })

      if (stationError || !radioStation) {
        throw new Error('Failed to create radio station')
      }

      // Add songs to radio station
      for (let i = 0; i < suggestion.songs.length; i++) {
        const songSuggestion = suggestion.songs[i]
        
        // Find matching song in database
        const matchingSong = availableSongs.find(song => 
          song.title.toLowerCase().includes(songSuggestion.title.toLowerCase()) ||
          (song.artist?.name && song.artist.name.toLowerCase().includes(songSuggestion.artist.toLowerCase()))
        )

        if (matchingSong) {
          await addSongToRadioStation(radioStation.id, matchingSong.id, i)
        }
      }

      // Update job as completed
      await updateAIRadioJob(jobId, {
        status: 'completed',
        radio_station_id: radioStation.id
      })

    } catch (error) {
      console.error('Error processing AI radio job:', error)
      
      // Update job as failed
      await updateAIRadioJob(jobId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async generateRadioSuggestion(prompt: string, availableSongs: Song[]): Promise<AIRadioSuggestion> {
    // Create a summary of available songs for the AI
    const songsList = availableSongs.slice(0, 100).map(song => 
      `"${song.title}" by ${song.artist?.name || 'Unknown'} (${song.genre || 'Unknown genre'})`
    ).join('\n')

    const aiPrompt = `
You are a music curator AI. Based on the user's request: "${prompt}"

Available songs in our database:
${songsList}

Create a radio station that matches the user's request. Select 10-15 songs from the available songs that best fit the request.

Respond with a JSON object in this exact format:
{
  "name": "Radio Station Name",
  "description": "Brief description of the radio station and its theme",
  "genre": "Main genre",
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "reason": "Why this song fits the request"
    }
  ]
}

Only include songs that are actually in the provided list. Make sure the JSON is valid and follows the exact format above.
`

    try {
      const result = await this.model.generateContent(aiPrompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }

      const suggestion: AIRadioSuggestion = JSON.parse(jsonMatch[0])
      
      // Validate the response
      if (!suggestion.name || !suggestion.songs || !Array.isArray(suggestion.songs)) {
        throw new Error('Invalid AI response format')
      }

      return suggestion
    } catch (error) {
      console.error('Error generating AI suggestion:', error)
      
      // Fallback suggestion
      return {
        name: 'AI Generated Radio',
        description: 'A custom radio station generated based on your preferences',
        genre: 'Mixed',
        songs: availableSongs.slice(0, 10).map(song => ({
          title: song.title,
          artist: song.artist?.name || 'Unknown',
          reason: 'Selected for your listening pleasure'
        }))
      }
    }
  }

  async generateWeeklyRadio(userId: string, theme: string): Promise<{ success: boolean; error?: string }> {
    try {
      const weeklyPrompt = `Create a weekly themed radio station with the theme: "${theme}". 
      This should be a curated mix of songs that fit the theme and would be perfect for a week of listening.
      Include a variety of moods and energy levels while staying true to the theme.`

      const result = await this.generateRadioFromPrompt(userId, weeklyPrompt)
      return result
    } catch (error) {
      console.error('Error generating weekly radio:', error)
      return { success: false, error: 'Failed to generate weekly radio' }
    }
  }

  async processAllPendingJobs(): Promise<void> {
    try {
      const { data: pendingJobs } = await getPendingAIRadioJobs()
      
      if (!pendingJobs || pendingJobs.length === 0) {
        return
      }

      // Process jobs one by one to avoid overwhelming the AI API
      for (const job of pendingJobs) {
        await this.processAIRadioJob(job.id)
        // Add a small delay between jobs
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Error processing pending AI radio jobs:', error)
    }
  }
}

export const aiRadioGenerator = new AIRadioGenerator()
