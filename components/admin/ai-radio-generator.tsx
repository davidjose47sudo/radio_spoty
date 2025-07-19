"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Wand2, Music, Radio, Sparkles, TrendingUp, Calendar, Play, Save, RefreshCw } from "lucide-react"
import { generateRadioStation, generateWeeklyRadio, type RadioGenerationRequest } from "@/lib/gemini"

interface GeneratedStation {
  name: string
  description: string
  songs: Array<{
    title: string
    artist: string
    genre: string
    reasoning: string
  }>
  metadata: {
    theme: string
    mood: string
    target_audience: string
    generation_prompt: string
  }
}

export function AIRadioGenerator() {
  const [activeTab, setActiveTab] = useState("custom")
  const [loading, setLoading] = useState(false)
  const [generatedStation, setGeneratedStation] = useState<GeneratedStation | null>(null)
  const [progress, setProgress] = useState(0)

  // Custom generation form
  const [customRequest, setCustomRequest] = useState<RadioGenerationRequest>({
    theme: "",
    mood: "",
    genres: [],
    duration: 60,
    target_audience: "",
    special_instructions: "",
  })

  // Weekly radio settings
  const [weeklySettings, setWeeklySettings] = useState({
    auto_generate: true,
    schedule_day: "monday",
    schedule_time: "06:00",
    include_new_releases: true,
    discovery_percentage: 30,
  })

  const availableGenres = [
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
  ]
  const moods = ["Energetic", "Chill", "Upbeat", "Melancholic", "Romantic", "Motivational", "Relaxing", "Party"]
  const themes = ["Workout", "Study", "Party", "Road Trip", "Romance", "Focus", "Sleep", "Morning", "Evening"]

  const generateCustomRadio = async () => {
    if (!customRequest.theme && !customRequest.mood) {
      alert("Please provide at least a theme or mood")
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const result = await generateRadioStation(customRequest)

      clearInterval(progressInterval)
      setProgress(100)
      setGeneratedStation(result)
    } catch (error) {
      console.error("Error generating radio:", error)
      alert("Failed to generate radio station. Please try again.")
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const generateWeeklyRadioStation = async () => {
    setLoading(true)
    setProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 300)

      const result = await generateWeeklyRadio()

      clearInterval(progressInterval)
      setProgress(100)
      setGeneratedStation(result)
    } catch (error) {
      console.error("Error generating weekly radio:", error)
      alert("Failed to generate weekly radio. Please try again.")
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const saveGeneratedStation = async () => {
    if (!generatedStation) return

    try {
      // Here you would save the generated station to your database
      const response = await fetch("/api/admin/radio-stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: generatedStation.name,
          description: generatedStation.description,
          is_ai_generated: true,
          ai_prompt: generatedStation.metadata.generation_prompt,
          songs: generatedStation.songs,
          metadata: generatedStation.metadata,
        }),
      })

      if (response.ok) {
        alert("Radio station saved successfully!")
        setGeneratedStation(null)
      } else {
        throw new Error("Failed to save station")
      }
    } catch (error) {
      console.error("Error saving station:", error)
      alert("Failed to save radio station. Please try again.")
    }
  }

  const addGenre = (genre: string) => {
    if (!customRequest.genres?.includes(genre)) {
      setCustomRequest({
        ...customRequest,
        genres: [...(customRequest.genres || []), genre],
      })
    }
  }

  const removeGenre = (genre: string) => {
    setCustomRequest({
      ...customRequest,
      genres: customRequest.genres?.filter((g) => g !== genre) || [],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            AI Radio Generator
          </h2>
          <p className="text-gray-400">Create personalized radio stations using artificial intelligence</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/20 text-green-400">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Gemini AI
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="custom" className="text-white">
            <Wand2 className="w-4 h-4 mr-2" />
            Custom Generation
          </TabsTrigger>
          <TabsTrigger value="weekly" className="text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Weekly Radio
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            AI Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Generation Form */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Station Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-white">
                    Theme
                  </Label>
                  <Select
                    value={customRequest.theme}
                    onValueChange={(value) => setCustomRequest({ ...customRequest, theme: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mood" className="text-white">
                    Mood
                  </Label>
                  <Select
                    value={customRequest.mood}
                    onValueChange={(value) => setCustomRequest({ ...customRequest, mood: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Genres</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant={customRequest.genres?.includes(genre) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          customRequest.genres?.includes(genre)
                            ? "bg-green-500 text-white"
                            : "border-gray-600 text-gray-400 hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          if (customRequest.genres?.includes(genre)) {
                            removeGenre(genre)
                          } else {
                            addGenre(genre)
                          }
                        }}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-white">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={customRequest.duration}
                    onChange={(e) => setCustomRequest({ ...customRequest, duration: Number(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                    min="30"
                    max="180"
                  />
                </div>

                <div>
                  <Label htmlFor="audience" className="text-white">
                    Target Audience
                  </Label>
                  <Input
                    id="audience"
                    value={customRequest.target_audience}
                    onChange={(e) => setCustomRequest({ ...customRequest, target_audience: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., Young adults, Fitness enthusiasts"
                  />
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-white">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={customRequest.special_instructions}
                    onChange={(e) => setCustomRequest({ ...customRequest, special_instructions: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Any specific requirements or preferences..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={generateCustomRadio}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Radio Station
                    </>
                  )}
                </Button>

                {loading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-400 text-center">
                      {progress < 30 && "Analyzing preferences..."}
                      {progress >= 30 && progress < 60 && "Selecting songs..."}
                      {progress >= 60 && progress < 90 && "Creating playlist..."}
                      {progress >= 90 && "Finalizing station..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Station Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Radio className="w-5 h-5 mr-2" />
                  Generated Station
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedStation ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{generatedStation.name}</h3>
                      <p className="text-gray-400">{generatedStation.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">{generatedStation.metadata.theme}</Badge>
                      <Badge className="bg-purple-500/20 text-purple-400">{generatedStation.metadata.mood}</Badge>
                      <Badge className="bg-green-500/20 text-green-400">{generatedStation.songs.length} songs</Badge>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {generatedStation.songs.map((song, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                          <div>
                            <div className="text-white font-medium">{song.title}</div>
                            <div className="text-gray-400 text-sm">{song.artist}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {song.genre}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={saveGeneratedStation} className="bg-green-500 hover:bg-green-600 flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save Station
                      </Button>
                      <Button variant="outline" className="border-gray-600 text-white bg-transparent">
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Radio className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Generated station will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Weekly Radio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-generate"
                  checked={weeklySettings.auto_generate}
                  onCheckedChange={(checked) =>
                    setWeeklySettings({ ...weeklySettings, auto_generate: checked as boolean })
                  }
                />
                <Label htmlFor="auto-generate" className="text-white">
                  Automatically generate weekly radio
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Schedule Day</Label>
                  <Select
                    value={weeklySettings.schedule_day}
                    onValueChange={(value) => setWeeklySettings({ ...weeklySettings, schedule_day: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Schedule Time</Label>
                  <Input
                    type="time"
                    value={weeklySettings.schedule_time}
                    onChange={(e) => setWeeklySettings({ ...weeklySettings, schedule_time: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-releases"
                  checked={weeklySettings.include_new_releases}
                  onCheckedChange={(checked) =>
                    setWeeklySettings({ ...weeklySettings, include_new_releases: checked as boolean })
                  }
                />
                <Label htmlFor="new-releases" className="text-white">
                  Include new releases
                </Label>
              </div>

              <div>
                <Label className="text-white">Discovery Percentage</Label>
                <Input
                  type="number"
                  value={weeklySettings.discovery_percentage}
                  onChange={(e) =>
                    setWeeklySettings({ ...weeklySettings, discovery_percentage: Number(e.target.value) })
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                  min="0"
                  max="100"
                />
                <p className="text-sm text-gray-400 mt-1">Percentage of new/discovery songs vs familiar favorites</p>
              </div>

              <Button
                onClick={generateWeeklyRadioStation}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Weekly Radio...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate This Week's Radio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">AI Generations Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">47</div>
                <p className="text-xs text-green-400">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">94.2%</div>
                <p className="text-xs text-green-400">+2.1% this week</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Avg Generation Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12.4s</div>
                <p className="text-xs text-yellow-400">-0.8s from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent AI Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">Chill Evening Mix</div>
                    <div className="text-gray-400 text-sm">Generated 5 minutes ago</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Success</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">Workout Energy Station</div>
                    <div className="text-gray-400 text-sm">Generated 12 minutes ago</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Success</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">Jazz Lounge Vibes</div>
                    <div className="text-gray-400 text-sm">Generated 18 minutes ago</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Success</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="text-white font-medium">Study Focus Mix</div>
                    <div className="text-gray-400 text-sm">Generated 25 minutes ago</div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400">Failed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
