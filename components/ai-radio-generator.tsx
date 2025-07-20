'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Wand2, Radio, CheckCircle, XCircle } from 'lucide-react'

interface AIRadioGeneratorProps {
  userSubscription?: string
}

export function AIRadioGenerator({ userSubscription }: AIRadioGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationJob, setGenerationJob] = useState<{
    id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    error_message?: string
    radio_station?: any
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isPremium = userSubscription === 'premium' || userSubscription === 'family'

  const handleGenerateRadio = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your AI radio')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGenerationJob(null)

    try {
      const response = await fetch('/api/ai-radio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI radio')
      }

      // Start polling for job status
      const jobId = data.jobId
      setGenerationJob({ id: jobId, status: 'pending' })
      pollJobStatus(jobId)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI radio')
    } finally {
      setIsGenerating(false)
    }
  }

  const pollJobStatus = async (jobId: string) => {
    const maxAttempts = 60 // Poll for up to 5 minutes
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/ai-radio/status?jobId=${jobId}`)
        const data = await response.json()

        if (response.ok) {
          setGenerationJob(data)

          if (data.status === 'completed' || data.status === 'failed') {
            return // Stop polling
          }
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Poll every 5 seconds
        } else {
          setError('Generation timed out. Please try again.')
        }
      } catch (err) {
        console.error('Error polling job status:', err)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000)
        }
      }
    }

    setTimeout(poll, 2000) // Start polling after 2 seconds
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Queued for processing...'
      case 'processing':
        return 'AI is curating your radio station...'
      case 'completed':
        return 'Your AI radio is ready!'
      case 'failed':
        return 'Generation failed'
      default:
        return status
    }
  }

  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Radio Generator
          </CardTitle>
          <CardDescription>
            Create personalized radio stations with artificial intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              AI Radio Generation is a premium feature. Upgrade your subscription to create custom radio stations with AI.
            </AlertDescription>
          </Alert>
          <Button className="mt-4" disabled>
            <Wand2 className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Radio Generator
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
        <CardDescription>
          Describe your perfect radio station and let AI curate the perfect playlist for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!generationJob && (
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="text-sm font-medium">
                Describe your ideal radio station
              </label>
              <Textarea
                id="prompt"
                placeholder="e.g., 'Chill indie rock for late night coding sessions' or 'Upbeat pop hits from the 2000s for my morning workout'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            
            <Button 
              onClick={handleGenerateRadio}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting Generation...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate AI Radio
                </>
              )}
            </Button>
          </div>
        )}

        {generationJob && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(generationJob.status)}
                <span className="font-medium">{getStatusText(generationJob.status)}</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Prompt: "{prompt}"
              </p>

              {generationJob.status === 'failed' && generationJob.error_message && (
                <p className="text-sm text-red-500">
                  Error: {generationJob.error_message}
                </p>
              )}

              {generationJob.status === 'completed' && generationJob.radio_station && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Radio className="h-4 w-4" />
                    <span className="font-medium">{generationJob.radio_station.name}</span>
                  </div>
                  <Button
                    onClick={() => window.location.href = `/station/${generationJob.radio_station.id}`}
                    className="w-full"
                  >
                    Listen to Your AI Radio
                  </Button>
                </div>
              )}
            </div>

            {generationJob.status === 'failed' && (
              <Button
                onClick={() => {
                  setGenerationJob(null)
                  setError(null)
                }}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• AI will select from songs available in our database</p>
          <p>• Generation typically takes 1-2 minutes</p>
          <p>• Be specific about mood, genre, or activity for best results</p>
        </div>
      </CardContent>
    </Card>
  )
}
