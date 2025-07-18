"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Music } from "lucide-react"

interface MusicPreferencesProps {
  onComplete: (preferences: any) => void
}

export function MusicPreferences({ onComplete }: MusicPreferencesProps) {
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "R&B",
    "Country",
    "Reggae",
    "Blues",
    "Folk",
    "Indie",
    "Metal",
    "Punk",
    "Funk",
    "Soul",
    "Alternative",
    "Latin",
  ]

  const moods = [
    "Energetic",
    "Relaxed",
    "Happy",
    "Melancholic",
    "Focused",
    "Romantic",
    "Aggressive",
    "Peaceful",
    "Nostalgic",
    "Uplifting",
    "Dark",
    "Dreamy",
    "Intense",
    "Chill",
    "Motivational",
    "Sad",
  ]

  const artists = [
    "The Weeknd",
    "Billie Eilish",
    "Drake",
    "Taylor Swift",
    "Ed Sheeran",
    "Ariana Grande",
    "Post Malone",
    "Dua Lipa",
    "Bad Bunny",
    "Olivia Rodrigo",
    "Harry Styles",
    "Doja Cat",
    "The Beatles",
    "Queen",
    "Michael Jackson",
    "Beyoncé",
    "Eminem",
    "Kanye West",
    "Rihanna",
    "Bruno Mars",
  ]

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
  }

  const handleArtistToggle = (artist: string) => {
    setSelectedArtists((prev) => (prev.includes(artist) ? prev.filter((a) => a !== artist) : [...prev, artist]))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onComplete({
        genres: selectedGenres,
        moods: selectedMoods,
        artists: selectedArtists,
      })
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedGenres.length >= 3
      case 2:
        return selectedMoods.length >= 3
      case 3:
        return selectedArtists.length >= 3
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-900/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 && "What genres do you love?"}
              {step === 2 && "What's your mood?"}
              {step === 3 && "Who are your favorite artists?"}
            </h1>
            <p className="text-gray-400">
              {step === 1 && "Select at least 3 genres to personalize your experience"}
              {step === 2 && "Choose moods that match your listening habits"}
              {step === 3 && "Pick artists you enjoy listening to"}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}% complete</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
          </div>

          {/* Content */}
          <div className="mb-8">
            {step === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer p-3 text-center justify-center transition-all ${
                      selectedGenres.includes(genre)
                        ? "bg-green-500 text-black hover:bg-green-600"
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {moods.map((mood) => (
                  <Badge
                    key={mood}
                    variant={selectedMoods.includes(mood) ? "default" : "outline"}
                    className={`cursor-pointer p-3 text-center justify-center transition-all ${
                      selectedMoods.includes(mood)
                        ? "bg-green-500 text-black hover:bg-green-600"
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }`}
                    onClick={() => handleMoodToggle(mood)}
                  >
                    {mood}
                  </Badge>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {artists.map((artist) => (
                  <div
                    key={artist}
                    className={`cursor-pointer p-4 rounded-lg border transition-all ${
                      selectedArtists.includes(artist)
                        ? "bg-green-500/20 border-green-500"
                        : "bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
                    }`}
                    onClick={() => handleArtistToggle(artist)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{artist}</p>
                        <p className="text-gray-400 text-sm">Artist</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected count */}
          <div className="text-center mb-6">
            <p className="text-gray-400">
              {step === 1 && `${selectedGenres.length} genres selected (minimum 3)`}
              {step === 2 && `${selectedMoods.length} moods selected (minimum 3)`}
              {step === 3 && `${selectedArtists.length} artists selected (minimum 3)`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              onClick={() => (step > 1 ? setStep(step - 1) : null)}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-black font-medium"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === 3 ? "Complete Setup" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
